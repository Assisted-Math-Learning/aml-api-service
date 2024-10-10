import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { schemaValidation } from '../../../services/validationService';
import learnerProficiencyDataSyncJSON from './syncLearnerProficiencyDataValidationSchema.json';
import logger from '../../../utils/logger';
import { ResponseHandler } from '../../../utils/responseHandler';
import { amlError } from '../../../types/amlError';
import {
  createLearnerProficiencyQuestionLevelData,
  createLearnerProficiencyQuestionSetLevelData,
  getQuestionLevelDataByLearnerIdAndQuestionId,
  getQuestionLevelDataRecordsForLearner,
  getQuestionSetLevelDataByLearnerIdAndQuestionSetId,
  getRecordsForLearnerByQuestionSetId,
  updateLearnerProficiencyQuestionLevelData,
  updateLearnerProficiencyQuestionSetLevelData,
} from '../../../services/learnerProficiencyData';
import { getQuestionSetsByIdentifiers } from '../../../services/questionSet';
import { getQuestionsByIdentifiers, getQuestionsCountForQuestionSet } from '../../../services/question';
import * as uuid from 'uuid';
import {
  aggregateLearnerData,
  calculateAverageScoreForQuestionSet,
  calculateSubSkillScoresForQuestion,
  calculateSubSkillScoresForQuestionSet,
  getAggregateDataForGivenTaxonomyKey,
} from './aggregation.helper';
import { createLearnerJourney, readLearnerJourneyByLearnerIdAndQuestionSetId, updateLearnerJourney } from '../../../services/learnerJourney';
import { LearnerJourneyStatus } from '../../../enums/learnerJourneyStatus';

const aggregateLearnerDataOnClassAndSkillLevel = async (learnerId: string, questionLevelData: any[]) => {
  const classMap = getAggregateDataForGivenTaxonomyKey(questionLevelData, 'class');
  const l1SkillMap = getAggregateDataForGivenTaxonomyKey(questionLevelData, 'l1_skill');
  const l2SkillMap = getAggregateDataForGivenTaxonomyKey(questionLevelData, 'l2_skill');
  const l3SkillMap = getAggregateDataForGivenTaxonomyKey(questionLevelData, 'l3_skill');

  await aggregateLearnerData(learnerId, 'class', classMap, questionLevelData?.[0]?.taxonomy?.board);
  await aggregateLearnerData(learnerId, 'l1_skill', l1SkillMap, questionLevelData?.[0]?.taxonomy?.board);
  await aggregateLearnerData(learnerId, 'l2_skill', l2SkillMap, questionLevelData?.[0]?.taxonomy?.board);
  await aggregateLearnerData(learnerId, 'l3_skill', l3SkillMap, questionLevelData?.[0]?.taxonomy?.board);
};

const learnerProficiencyDataSync = async (req: Request, res: Response) => {
  const apiId = _.get(req, 'id');
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const dataBody = _.get(req, 'body.request');
  const resmsgid = _.get(res, 'resmsgid');

  // TODO: validate learner_id

  const isRequestValid: Record<string, any> = schemaValidation(requestBody, learnerProficiencyDataSyncJSON);

  if (!isRequestValid.isValid) {
    const code = 'LEARNER_PROFICIENCY_DATA_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  const { learner_id, questions_data } = dataBody;

  const questionMap: any = {};

  /**
   * DB QUERIES
   */
  const questionIds = questions_data.map((datum: any) => datum.question_id);
  const questions = await getQuestionsByIdentifiers(questionIds);

  const questionSetIds = _.uniq(questions_data.map((datum: any) => datum.question_set_id));
  const questionSets = await getQuestionSetsByIdentifiers(questionSetIds as string[]);

  for (const question of questions) {
    _.set(questionMap, question.identifier, question);
  }

  /**
   * Updating question level data in the following block
   */
  for (const datum of questions_data) {
    const { question_id, learner_response } = datum;
    const question = _.get(questionMap, question_id, undefined);

    /**
     * Validating question_id
     */
    if (!question) {
      logger.error({ apiId, msgid, resmsgid, requestBody, message: `question with identifier ${question_id} not found` });
      continue;
    }

    // TODO: conclude score on the basis of correct answer vs learner response

    const subSkillScores = calculateSubSkillScoresForQuestion(question, learner_response);

    /**
     * If an entry already exists for the (learner_id, question_id) pair, then we increment the attempt count & update the new values
     */
    const learnerDataExists = await getQuestionLevelDataByLearnerIdAndQuestionId(learner_id, question_id);
    if (!_.isEmpty(learnerDataExists)) {
      const updateData = {
        ...datum,
        sub_skills: subSkillScores,
        attempts_count: learnerDataExists.attempts_count + 1,
        updated_by: uuid.v4(), // TODO: replace with valid user id
      };
      await updateLearnerProficiencyQuestionLevelData(learnerDataExists.identifier, updateData);
      continue;
    }

    await createLearnerProficiencyQuestionLevelData({
      ...datum,
      identifier: uuid.v4(),
      learner_id,
      question_set_id: question.question_set_id,
      taxonomy: question.taxonomy,
      sub_skills: subSkillScores,
      created_by: uuid.v4(), // TODO: replace with valid user id
    });
  }

  /**
   * Updating question set level data in the following block
   */
  for (const questionSet of questionSets) {
    const totalQuestionsCount = await getQuestionsCountForQuestionSet(questionSet.identifier);
    const attemptedQuestions = await getRecordsForLearnerByQuestionSetId(learner_id, questionSet.identifier);
    const allQuestionsHaveEqualNumberOfAttempts = attemptedQuestions.every((question: { attempts_count: number }) => question.attempts_count === (attemptedQuestions?.[0]?.attempts_count || 0));
    if (totalQuestionsCount === attemptedQuestions.length && totalQuestionsCount > 0 && allQuestionsHaveEqualNumberOfAttempts) {
      const avgScore = calculateAverageScoreForQuestionSet(attemptedQuestions);
      const subSkillScores = calculateSubSkillScoresForQuestionSet(attemptedQuestions);
      /**
       * If an entry already exists for the (learner_id, question_set_id) pair, then we increment the attempt count
       */
      const learnerDataExists = await getQuestionSetLevelDataByLearnerIdAndQuestionSetId(learner_id, questionSet.identifier);
      if (!_.isEmpty(learnerDataExists)) {
        const updateData = {
          score: avgScore,
          sub_skills: subSkillScores,
          attempts_count: learnerDataExists.attempts_count + 1,
          updated_by: uuid.v4(), // TODO: replace with valid user id
        };
        await updateLearnerProficiencyQuestionSetLevelData(learnerDataExists.identifier, updateData);
        continue;
      }
      /**
       * If an entry does not exist for the (learner_id, question_set_id) pair, then we make an entry
       */
      await createLearnerProficiencyQuestionSetLevelData({
        identifier: uuid.v4(),
        learner_id,
        question_set_id: questionSet.identifier,
        taxonomy: questionSet.taxonomy,
        sub_skills: subSkillScores,
        score: avgScore,
        created_by: uuid.v4(), // TODO: replace with valid user id
      });
    }

    /**
     * Updating learner journey
     */
    const { learnerJourney } = await readLearnerJourneyByLearnerIdAndQuestionSetId(learner_id, questionSet.identifier);
    const completedQuestionIds = attemptedQuestions.map((data) => data.question_id);
    if (_.isEmpty(learnerJourney)) {
      await createLearnerJourney({
        learner_id,
        question_set_id: questionSet.identifier,
        status: allQuestionsHaveEqualNumberOfAttempts ? LearnerJourneyStatus.COMPLETE : LearnerJourneyStatus.IN_PROGRESS,
        completed_question_ids: completedQuestionIds,
        start_time: attemptedQuestions?.[0]?.created_at.toString(),
        end_time: allQuestionsHaveEqualNumberOfAttempts ? attemptedQuestions?.pop()?.created_at.toString() : null,
      });
    } else {
      await updateLearnerJourney(learnerJourney.identifier, {
        status: allQuestionsHaveEqualNumberOfAttempts ? LearnerJourneyStatus.COMPLETE : LearnerJourneyStatus.IN_PROGRESS,
        completed_question_ids: completedQuestionIds,
        start_time: attemptedQuestions?.[0]?.created_at?.toString(),
        end_time: allQuestionsHaveEqualNumberOfAttempts ? attemptedQuestions?.pop()?.created_at?.toString() : null,
        attempts_count: allQuestionsHaveEqualNumberOfAttempts ? learnerJourney?.attempts_count + 1 : learnerJourney.attempts_count,
      });
    }
  }

  /**
   * Updating grade/skill level data in the following block
   */
  const learnerAttempts = await getQuestionLevelDataRecordsForLearner(learner_id);

  await aggregateLearnerDataOnClassAndSkillLevel(learner_id, learnerAttempts);

  ResponseHandler.successResponse(req, res, {
    status: httpStatus.OK,
    data: { message: 'Learner data synced successfully' },
  });
};

export default learnerProficiencyDataSync;
