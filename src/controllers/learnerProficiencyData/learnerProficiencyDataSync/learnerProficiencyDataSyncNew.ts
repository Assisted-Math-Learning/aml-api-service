import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { schemaValidation } from '../../../services/validationService';
import learnerProficiencyDataSyncJSON from './syncLearnerProficiencyDataValidationSchema.json';
import logger from '../../../utils/logger';
import { ResponseHandler } from '../../../utils/responseHandler';
import { amlError } from '../../../types/amlError';
import {
  bulkCreateLearnerProficiencyQuestionLevelData,
  bulkReadLearnerProficiencyData,
  createLearnerProficiencyQuestionSetLevelData,
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

const learnerProficiencyDataSyncNew = async (req: Request, res: Response) => {
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

  const questionSetId = questions_data?.[0]?.question_set_id;
  logger.info(`[learnerProficiencyDataSync] msgid: ${msgid} timestamp: ${moment().format('DD-MM-YYYY hh:mm:ss')} action: reading question set`);
  const questionSet = await questionSetService.getQuestionSetById(questionSetId);
  logger.info(`[learnerProficiencyDataSync] msgid: ${msgid} timestamp: ${moment().format('DD-MM-YYYY hh:mm:ss')} action: question set read`);

  if (!questionSet) {
    const code = 'QUESTION_SET_DOES_NOT_EXIST';
    logger.error(`code: ${code}, apiId: ${apiId}, msgid: ${msgid}, resmsgid: ${resmsgid}, message: 'Question Set does not exist`);
    throw amlError(code, 'Question Set does not exist', 'NOT_FOUND', 404);
  }

  for (const question of questions) {
    questionMap[question.identifier] = question;
  }

  const { learnerJourney } = await readLearnerJourneyByLearnerIdAndQuestionSetId(learner_id, questionSetId);

  const newLearnerAttempts: { [id: number]: LearnerProficiencyQuestionLevelData } = {};
  let attemptNumber = 1;

  if (learnerJourney && learnerJourney.status === LearnerJourneyStatus.IN_PROGRESS) {
    attemptNumber = learnerJourney.attempt_number;
  } else if (learnerJourney && learnerJourney.status === LearnerJourneyStatus.COMPLETED) {
    attemptNumber = learnerJourney.attempt_number + 1;
  }

  const questionLevelBulkCreateData = [];
  const questionLevelDataUpdatePromises = [];

  const queryData = questions_data.map((datum: any) => ({
    learnerId: learner_id,
    questionId: datum.question_id,
    questionSetId: datum.question_set_id,
    attemptNumber: attemptNumber,
  }));

  const existingAttempts = await bulkReadLearnerProficiencyData(queryData);

  const existingAttemptsMap = existingAttempts.reduce((agg: any, curr) => {
    const key = `${curr.question_id}_${curr.question_set_id}_${curr.attempt_number}`;
    agg[key] = curr;
    return agg;
  }, {});

  logger.info(`[learnerProficiencyDataSync] msgid: ${msgid} transaction started`);
  const transaction = await AppDataSource.transaction();
  const transactionStartTime = Date.now();
  logger.info(`msgid: ${msgid} transactionStartTime: ${transactionStartTime}`);

  try {
    /**
     * DATA ACCUMULATION FOR QUESTION LEVEL DATA STARTS HERE
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
        questionSetTimestampMap[question_set_id]['start_time'] = start_time;
      }

      if (end_time && moment(end_time).isValid()) {
        questionSetTimestampMap[question_set_id]['end_time'] = end_time;
      }

      /**
       * If an entry already exists for the (learner_id, question_id, question_set_id) pair, then we increment the attempt count & update the new values
       */
      const key = `${question_id}_${question_set_id}_${attemptNumber}`;
      const learnerDataExists = existingAttemptsMap[key];
      if (learnerDataExists && !_.isEmpty(learnerDataExists)) {
        if (status === QuestionStatus.REVISITED) {
          const updateData = {
            learner_response,
            sub_skills: subSkillScores,
            score,
            updated_by: learner_id,
          };
          questionLevelDataUpdatePromises.push(updateLearnerProficiencyQuestionLevelData(transaction, learnerDataExists.identifier, updateData));
          newLearnerAttempts[learnerDataExists.id] = { ...learnerDataExists, ...updateData };
        }
        continue;
      }

      questionLevelBulkCreateData.push({
        identifier: uuid.v4(),
        learner_id,
        question_id,
        question_set_id,
        taxonomy: question.taxonomy,
        sub_skills: subSkillScores,
        learner_response,
        score,
        attempt_number: attemptNumber,
        created_by: learner_id,
      });
    }
    /**
     * DATA ACCUMULATION FOR QUESTION LEVEL DATA ENDS HERE
     */

    /**
     * DATA ACCUMULATION FOR QUESTION SET LEVEL DATA STARTS HERE
     */

    const questionMappings = await questionSetQuestionMappingService.getEntriesForQuestionSetId(questionSet.identifier);
    const totalQuestionsCount = (questionMappings || []).length;
    const pastAttemptedQuestions = learnerJourney && learnerJourney.status === LearnerJourneyStatus.IN_PROGRESS ? learnerJourney.completed_question_ids : [];
    const completedQuestionIds = _.uniq([...pastAttemptedQuestions, ...questionIds]);
    const pastLearnerAttempts = await getRecordsForLearnerByQuestionSetId(learner_id, questionSet.identifier, attemptNumber);
    const unUpdatedExistingAttempts = pastLearnerAttempts
      .map((attempt) => {
        if (Object.prototype.hasOwnProperty.call(newLearnerAttempts, attempt.id)) {
          return undefined;
        }
        return attempt;
      })
      .filter((v) => !!v);
    const allAttemptedQuestionsOfThisQuestionSet = [...unUpdatedExistingAttempts, ...Object.values(newLearnerAttempts)];

    /**
     * DATA ACCUMULATION FOR QUESTION SET LEVEL DATA ENDS HERE
     */

    logger.info(`[learnerProficiencyDataSync] msgid: ${msgid} timestamp: ${moment().format('DD-MM-YYYY hh:mm:ss')} action: creating question level data`);
    const newData = await bulkCreateLearnerProficiencyQuestionLevelData(transaction, questionLevelBulkCreateData);
    logger.info(`[learnerProficiencyDataSync] msgid: ${msgid} timestamp: ${moment().format('DD-MM-YYYY hh:mm:ss')} action: question level data created`);

    if (questionLevelDataUpdatePromises.length) {
      logger.info(`[learnerProficiencyDataSync] msgid: ${msgid} timestamp: ${moment().format('DD-MM-YYYY hh:mm:ss')} action: updating question level data`);
      await Promise.all(questionLevelDataUpdatePromises);
      logger.info(`[learnerProficiencyDataSync] msgid: ${msgid} timestamp: ${moment().format('DD-MM-YYYY hh:mm:ss')} action: question level data updated`);
    }

    for (const datum of newData) {
      newLearnerAttempts[datum.dataValues.id] = datum.dataValues;
    }

    /**
     * Updating question set level data in the following block
     */
    logger.info(`[learnerProficiencyDataSync] msgid: ${msgid} timestamp: ${moment().format('DD-MM-YYYY hh:mm:ss')} action: updating question set level data`);

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
        attempt_number: attemptNumber,
      });
    }
    logger.info(`[learnerProficiencyDataSync] msgid: ${msgid} timestamp: ${moment().format('DD-MM-YYYY hh:mm:ss')} action: question set level data updated`);

    /**
     * Updating learner journey
     */
    logger.info(`[learnerProficiencyDataSync] msgid: ${msgid} timestamp: ${moment().format('DD-MM-YYYY hh:mm:ss')} action: updating learner journey`);
    const start_time = _.get(questionSetTimestampMap, [questionSet.identifier, 'start_time']);
    const end_time = _.get(questionSetTimestampMap, [questionSet.identifier, 'end_time']);
    const journeyStatus = totalQuestionsCount === completedQuestionIds.length ? LearnerJourneyStatus.COMPLETED : LearnerJourneyStatus.IN_PROGRESS;
    if (learnerJourney && learnerJourney.status === LearnerJourneyStatus.IN_PROGRESS) {
      const payload: any = {
        status: journeyStatus,
        completed_question_ids: completedQuestionIds,
        updated_by: learner_id,
        end_time: journeyStatus === LearnerJourneyStatus.IN_PROGRESS ? null : learnerJourney.end_time,
      };
      if (start_time) {
        payload['start_time'] = start_time;
      }
      if (end_time) {
        payload['end_time'] = end_time;
      }
      await updateLearnerJourney(transaction, learnerJourney.identifier, payload);
    } else {
      const payload: any = {
        identifier: uuid.v4(),
        learner_id,
        question_set_id: questionSet.identifier,
        status: journeyStatus,
        completed_question_ids: completedQuestionIds,
        created_by: learner_id,
        attempt_number: attemptNumber,
      };
      if (start_time) {
        payload['start_time'] = start_time;
      }
      if (end_time) {
        payload['end_time'] = end_time;
      }
      await createLearnerJourney(transaction, payload);
    }

    logger.info(`[learnerProficiencyDataSync] msgid: ${msgid} timestamp: ${moment().format('DD-MM-YYYY hh:mm:ss')} action: learner journey updated`);

    if (questionSet.purpose === QuestionSetPurposeType.MAIN_DIAGNOSTIC) {
      /**
       * Updating grade/skill level data in the following block (only for Main Diagnostic Question Set)
       */
      logger.info(`[learnerProficiencyDataSync] msgid: ${msgid} timestamp: ${moment().format('DD-MM-YYYY hh:mm:ss')} action: reading learner attempts`);
      const existingLearnerAttempts = await getRecordsForLearnerByQuestionSetId(learner_id, questionSet.identifier, attemptNumber);
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

    logger.info(`[learnerProficiencyDataSync] msgid: ${msgid} timestamp: ${moment().format('DD-MM-YYYY hh:mm:ss')} action: COMMITING TRANSACTION`);
    await transaction.commit();
    logger.info(`[learnerProficiencyDataSync] msgid: ${msgid} timestamp: ${moment().format('DD-MM-YYYY hh:mm:ss')} action: COMMIT TRANSACTION DONE`);
    const transactionEndTime = Date.now();
    logger.info(`transactionEndTime: ${transactionEndTime}`);
    logger.info(`transaction ran for: ${transactionEndTime - transactionStartTime}`);
  } catch (e: any) {
    logger.info(`[learnerProficiencyDataSync] msgid: ${msgid} timestamp: ${moment().format('DD-MM-YYYY hh:mm:ss')} action: ROLLING BACK TRANSACTION`);
    await transaction.rollback();
    logger.info(`[learnerProficiencyDataSync] msgid: ${msgid} timestamp: ${moment().format('DD-MM-YYYY hh:mm:ss')} action: ROLLBACK TRANSACTION DONE`);
    const transactionEndTime = Date.now();
    logger.info(`msgid: ${msgid} transactionEndTime: ${transactionEndTime}`);
    logger.info(`msgid: ${msgid} transaction ran for: ${transactionStartTime - transactionEndTime}`);
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

export default learnerProficiencyDataSyncNew;
