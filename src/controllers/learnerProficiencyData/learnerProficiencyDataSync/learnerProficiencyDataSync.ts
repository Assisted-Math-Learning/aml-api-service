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
  getQuestionLevelDataByLearnerIdQuestionIdAndQuestionSetId,
  getRecordsForLearnerByQuestionSetId,
  updateLearnerProficiencyQuestionLevelData,
} from '../../../services/learnerProficiencyData';
import { questionSetService } from '../../../services/questionSetService';
import { questionService } from '../../../services/questionService';
import * as uuid from 'uuid';
import {
  aggregateLearnerData,
  calculateAverageScoreForQuestionSet,
  calculateSubSkillScoresForQuestion,
  calculateSubSkillScoresForQuestionSet,
  getLearnerAggregateDataForClassAndL1SkillPair,
  getScoreForTheQuestion,
} from './aggregation.helper';
import { createLearnerJourney, readLearnerJourney, readLearnerJourneyByLearnerIdAndQuestionSetId, updateLearnerJourney } from '../../../services/learnerJourney';
import { LearnerJourneyStatus } from '../../../enums/learnerJourneyStatus';
import moment from 'moment';
import { Learner } from '../../../models/learner';
import { ApiLogs } from '../../../models/apiLogs';
import { AppDataSource } from '../../../config';
import { LearnerProficiencyQuestionLevelData } from '../../../models/learnerProficiencyQuestionLevelData';
import { QuestionSetPurposeType } from '../../../enums/questionSetPurposeType';
import { QuestionStatus } from '../../../enums/status';
import { questionSetQuestionMappingService } from '../../../services/questionSetQuestionMappingService';

const aggregateLearnerDataOnClassAndSkillLevel = async (transaction: any, learner: Learner, questionLevelData: any[]) => {
  const aggregateData = getLearnerAggregateDataForClassAndL1SkillPair(questionLevelData);
  await aggregateLearnerData(transaction, learner, aggregateData);
};

const learnerProficiencyDataSync = async (req: Request, res: Response) => {
  const apiId = _.get(req, 'id');
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const dataBody = _.get(req, 'body.request');
  const resmsgid = _.get(res, 'resmsgid');
  const learner = (req as any).learner;

  const apiLog = await ApiLogs.create({
    learner_id: learner.id,
    request_type: apiId,
    request_body: dataBody,
  });

  logger.info(`[learnerProficiencyDataSync] msgid: ${msgid} timestamp: ${moment().format('DD-MM-YYYY hh:mm:ss')} action: validating request body`);
  const isRequestValid: Record<string, any> = schemaValidation(requestBody, learnerProficiencyDataSyncJSON);
  logger.info(`[learnerProficiencyDataSync] msgid: ${msgid} timestamp: ${moment().format('DD-MM-YYYY hh:mm:ss')} action: request body validated`);

  if (!isRequestValid.isValid) {
    const code = 'LEARNER_PROFICIENCY_DATA_INVALID_INPUT';
    logger.error(`code: ${code}, apiId: ${apiId}, msgid: ${msgid}, resmsgid: ${resmsgid}, message: ${isRequestValid.message}`);
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  const { learner_id, questions_data } = dataBody;

  if (learner.identifier !== learner_id) {
    const code = 'LEARNER_DOES_NOT_EXIST';
    logger.error(`code: ${code}, apiId: ${apiId}, msgid: ${msgid}, resmsgid: ${resmsgid}, message: 'Learner does not exist'`);
    throw amlError(code, 'Learner does not exist', 'NOT_FOUND', 404);
  }

  const questionMap: any = {};
  const questionSetTimestampMap: { [id: string]: { start_time?: string; end_time?: string } } = {};

  /**
   * DB QUERIES
   */
  const questionIds = questions_data.map((datum: any) => datum.question_id);
  logger.info(`[learnerProficiencyDataSync] msgid: ${msgid} timestamp: ${moment().format('DD-MM-YYYY hh:mm:ss')} action: reading questions`);
  const questions = await questionService.getQuestionsByIdentifiers(questionIds);
  logger.info(`[learnerProficiencyDataSync] msgid: ${msgid} timestamp: ${moment().format('DD-MM-YYYY hh:mm:ss')} action: questions read`);

  const questionSetIds = _.uniq(questions_data.map((datum: any) => datum.question_set_id));
  logger.info(`[learnerProficiencyDataSync] msgid: ${msgid} timestamp: ${moment().format('DD-MM-YYYY hh:mm:ss')} action: reading question sets`);
  const questionSets = await questionSetService.getQuestionSetsByIdentifiers(questionSetIds as string[]);
  logger.info(`[learnerProficiencyDataSync] msgid: ${msgid} timestamp: ${moment().format('DD-MM-YYYY hh:mm:ss')} action: question sets read`);

  for (const question of questions) {
    _.set(questionMap, question.identifier, question);
  }
  const transaction = await AppDataSource.transaction();

  const newLearnerAttempts: { [id: number]: LearnerProficiencyQuestionLevelData } = {};
  let highestAttemptNumber = 1;

  try {
    /**
     * Updating question level data in the following block
     */
    logger.info(`[learnerProficiencyDataSync] msgid: ${msgid} timestamp: ${moment().format('DD-MM-YYYY hh:mm:ss')} action: updating question level data`);
    for (const datum of questions_data) {
      const { question_id, question_set_id, start_time, end_time, status } = datum;
      const learner_response = datum.learner_response as { result: string; answerTop?: string };
      const question = _.get(questionMap, question_id, undefined);

      /**
       * Validating question_id
       */
      if (!question) {
        logger.error(`apiId: ${apiId}, msgid: ${msgid}, resmsgid: ${resmsgid}, message: question with identifier ${question_id} not found`);
        continue;
      }

      const score = getScoreForTheQuestion(question, learner_response);

      const subSkillScores = calculateSubSkillScoresForQuestion(question, learner_response);

      if (start_time && moment(start_time).isValid()) {
        _.set(questionSetTimestampMap, [question_set_id, 'start_time'], start_time);
      }

      if (end_time && moment(end_time).isValid()) {
        _.set(questionSetTimestampMap, [question_set_id, 'end_time'], end_time);
      }

      /**
       * If an entry already exists for the (learner_id, question_id, question_set_id) pair, then we increment the attempt count & update the new values
       */
      let attempt_number = 1;
      const learnerDataExists = await getQuestionLevelDataByLearnerIdQuestionIdAndQuestionSetId(learner_id, question_id, question_set_id);
      if (learnerDataExists && !_.isEmpty(learnerDataExists)) {
        if (status === QuestionStatus.REVISITED) {
          const updateData = {
            identifier: learnerDataExists.identifier,
            learner_response,
            sub_skills: subSkillScores,
            score,
            updated_by: learner_id,
          };
          await updateLearnerProficiencyQuestionLevelData(transaction, updateData);
          _.set(newLearnerAttempts, learnerDataExists?.id, { ...learnerDataExists, ...updateData });
          continue;
        } else {
          attempt_number = learnerDataExists.attempt_number + 1;
        }
      }

      const newData = await createLearnerProficiencyQuestionLevelData(transaction, {
        identifier: uuid.v4(),
        learner_id,
        question_id,
        question_set_id,
        taxonomy: question.taxonomy,
        sub_skills: subSkillScores,
        learner_response,
        score,
        attempt_number,
        created_by: learner_id,
      });
      _.set(newLearnerAttempts, newData.dataValues.id, newData.dataValues);
      highestAttemptNumber = attempt_number > highestAttemptNumber ? attempt_number : highestAttemptNumber;
    }
    logger.info(`[learnerProficiencyDataSync] msgid: ${msgid} timestamp: ${moment().format('DD-MM-YYYY hh:mm:ss')} action: question level data updated`);

    /**
     * Updating question set level data in the following block
     */
    logger.info(`[learnerProficiencyDataSync] msgid: ${msgid} timestamp: ${moment().format('DD-MM-YYYY hh:mm:ss')} action: updating question set level data`);
    for (const questionSet of questionSets) {
      const questionMappings = await questionSetQuestionMappingService.getEntriesForQuestionSetId(questionSet.identifier);
      const totalQuestionsCount = (questionMappings || []).length;
      const { learnerJourney } = await readLearnerJourneyByLearnerIdAndQuestionSetId(learner_id, questionSet.identifier);
      const pastAttemptedQuestions = learnerJourney && learnerJourney.status === LearnerJourneyStatus.IN_PROGRESS ? learnerJourney.completed_question_ids : [];
      const completedQuestionIds = _.uniq([...pastAttemptedQuestions, ...questionIds]);
      const pastLearnerAttempts = await getRecordsForLearnerByQuestionSetId(learner_id, questionSet.identifier, highestAttemptNumber);
      const unUpdatedExistingAttempts = pastLearnerAttempts
        .map((attempt) => {
          if (Object.prototype.hasOwnProperty.call(newLearnerAttempts, attempt.id)) {
            return undefined;
          }
          return attempt;
        })
        .filter((v) => !!v);
      const allAttemptedQuestionsOfThisQuestionSet = [...unUpdatedExistingAttempts, ...Object.values(newLearnerAttempts)];

      if (totalQuestionsCount === completedQuestionIds.length && totalQuestionsCount > 0) {
        const avgScore = calculateAverageScoreForQuestionSet(allAttemptedQuestionsOfThisQuestionSet);
        const subSkillScores = calculateSubSkillScoresForQuestionSet(allAttemptedQuestionsOfThisQuestionSet);
        await createLearnerProficiencyQuestionSetLevelData(transaction, {
          identifier: uuid.v4(),
          learner_id,
          question_set_id: questionSet.identifier,
          taxonomy: questionSet.taxonomy,
          sub_skills: subSkillScores,
          score: avgScore,
          created_by: learner_id,
          attempt_number: highestAttemptNumber,
        });
      }

      /**
       * Updating learner journey
       */
      const start_time = _.get(questionSetTimestampMap, [questionSet.identifier, 'start_time']);
      const end_time = _.get(questionSetTimestampMap, [questionSet.identifier, 'end_time']);
      const journeyStatus = totalQuestionsCount === completedQuestionIds.length ? LearnerJourneyStatus.COMPLETED : LearnerJourneyStatus.IN_PROGRESS;
      if (learnerJourney && learnerJourney.status === LearnerJourneyStatus.IN_PROGRESS) {
        if (learnerJourney.attempt_number !== highestAttemptNumber) {
          const code = 'DUPLICATE_ATTEMPT_IN_EXISTING_LEARNER_JOURNEY';
          throw amlError(code, 'Duplicate attempt in existing learner journey', 'BAD_REQUEST', 400);
        }
        const payload = {
          status: journeyStatus,
          completed_question_ids: completedQuestionIds,
          updated_by: learner_id,
          end_time: journeyStatus === LearnerJourneyStatus.IN_PROGRESS ? null : learnerJourney.end_time,
        };
        if (start_time) {
          _.set(payload, 'start_time', start_time);
        }
        if (end_time) {
          _.set(payload, 'end_time', end_time);
        }
        await updateLearnerJourney(transaction, learnerJourney.identifier, payload);
      } else {
        const payload = {
          identifier: uuid.v4(),
          learner_id,
          question_set_id: questionSet.identifier,
          status: journeyStatus,
          completed_question_ids: completedQuestionIds,
          created_by: learner_id,
          attempt_number: highestAttemptNumber,
        };
        if (start_time) {
          _.set(payload, 'start_time', start_time);
        }
        if (end_time) {
          _.set(payload, 'end_time', end_time);
        }
        await createLearnerJourney(transaction, payload);
      }
    }
    logger.info(`[learnerProficiencyDataSync] msgid: ${msgid} timestamp: ${moment().format('DD-MM-YYYY hh:mm:ss')} action: question set level data updated`);

    if (questionSets?.[0]?.purpose === QuestionSetPurposeType.MAIN_DIAGNOSTIC) {
      /**
       * Updating grade/skill level data in the following block (only for Main Diagnostic Question Set)
       */
      logger.info(`[learnerProficiencyDataSync] msgid: ${msgid} timestamp: ${moment().format('DD-MM-YYYY hh:mm:ss')} action: reading learner attempts`);
      const existingLearnerAttempts = await getRecordsForLearnerByQuestionSetId(learner_id, questionSets?.[0]?.identifier, highestAttemptNumber);
      logger.info(`[learnerProficiencyDataSync] msgid: ${msgid} timestamp: ${moment().format('DD-MM-YYYY hh:mm:ss')} action: learner attempts read`);

      const unUpdatedExistingAttempts = existingLearnerAttempts
        .map((attempt) => {
          if (Object.prototype.hasOwnProperty.call(newLearnerAttempts, attempt.id)) {
            return undefined;
          }
          return attempt;
        })
        .filter((v) => !!v);
      logger.info(`[learnerProficiencyDataSync] msgid: ${msgid} timestamp: ${moment().format('DD-MM-YYYY hh:mm:ss')} action: aggregating learner data`);
      await aggregateLearnerDataOnClassAndSkillLevel(transaction, learner, [...unUpdatedExistingAttempts, ...Object.values(newLearnerAttempts)]);
      logger.info(`[learnerProficiencyDataSync] msgid: ${msgid} timestamp: ${moment().format('DD-MM-YYYY hh:mm:ss')} action: learner data aggregated`);
    } else {
      logger.info(`[learnerProficiencyDataSync] msgid: ${msgid} timestamp: ${moment().format('DD-MM-YYYY hh:mm:ss')} action: skipped learner data aggregation`);
    }
    await transaction.commit();
    logger.info(`[learnerProficiencyDataSync] msgid: ${msgid} timestamp: ${moment().format('DD-MM-YYYY hh:mm:ss')} action: COMMIT TRANSACTION`);
  } catch (e: any) {
    await transaction.rollback();
    logger.error(`[learnerProficiencyDataSync] msgid: ${msgid} timestamp: ${moment().format('DD-MM-YYYY hh:mm:ss')} action: ROLLBACK TRANSACTION`);
    apiLog.error_body = JSON.stringify(Object.entries(e));
    await apiLog.save();
    throw e;
  } finally {
    //@ts-expect-error no typings
    AppDataSource.connectionManager.releaseConnection(transaction.connection);
  }

  const { learnerJourney: latestLearnerJourney } = await readLearnerJourney(learner_id);

  ResponseHandler.successResponse(req, res, {
    status: httpStatus.OK,
    data: { message: 'Learner data synced successfully', data: latestLearnerJourney },
  });
};

export default learnerProficiencyDataSync;
