import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { schemaValidation } from '../../../services/validationService';
import learnerCreateJSON from './createLearnerJourneyValidationSchema.json';
import logger from '../../../utils/logger';
import { ResponseHandler } from '../../../utils/responseHandler';
import { amlError } from '../../../types/amlError';
import { createLearnerJourney, readLearnerJourneyByLearnerIdAndQuestionSetId, updateLearnerJourney } from '../../../services/learnerJourney';
import * as uuid from 'uuid';
import moment from 'moment';
import { LearnerJourneyStatus } from '../../../enums/learnerJourneyStatus';
import { AppDataSource } from '../../../config';

export const apiId = 'api.learner.journey.create';

const learnerJourneyCreate = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const dataBody = _.get(req, 'body.request');
  const resmsgid = _.get(res, 'resmsgid');

  const isRequestValid: Record<string, any> = schemaValidation(requestBody, learnerCreateJSON);

  const invalidStartTime = dataBody.start_time && !moment(dataBody.start_time).isValid();

  if (!isRequestValid.isValid || invalidStartTime) {
    const code = 'LEARNER_JOURNEY_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: invalidStartTime ? 'Invalid start_time format' : isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  // TODO: validate learner_id & question_set_id

  const transaction = await AppDataSource.transaction();

  let { learnerJourney } = await readLearnerJourneyByLearnerIdAndQuestionSetId(dataBody.learner_id, dataBody.question_set_id);

  if (learnerJourney && learnerJourney.status === LearnerJourneyStatus.COMPLETED) {
    await updateLearnerJourney(transaction, learnerJourney.identifier, {
      attempts_count: learnerJourney.attempts_count + 1,
      start_time: dataBody.start_time,
      end_time: null,
      status: LearnerJourneyStatus.IN_PROGRESS,
    });
  } else {
    const learnerJourneyInsertData = {
      ...dataBody,
      identifier: uuid.v4(),
      created_by: uuid.v4(), // TODO: Replace with valid user identifier
    };

    learnerJourney = await createLearnerJourney(transaction, learnerJourneyInsertData);
  }

  await transaction.commit();

  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'learner journey started successfully', identifier: learnerJourney.dataValues.identifier } });
};

export default learnerJourneyCreate;
