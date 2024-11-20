import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { schemaValidation } from '../../../services/validationService';
import learnerUpdateJSON from './updateLearnerJourneyValidationSchema.json';
import logger from '../../../utils/logger';
import { ResponseHandler } from '../../../utils/responseHandler';
import { amlError } from '../../../types/amlError';
import { readLearnerJourney, updateLearnerJourney } from '../../../services/learnerJourney';
import moment from 'moment/moment';
import { AppDataSource } from '../../../config';

export const apiId = 'api.learner.journey.update';

const learnerJourneyUpdate = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const dataBody = _.get(req, 'body.request');
  const resmsgid = _.get(res, 'resmsgid');

  const isRequestValid: Record<string, any> = schemaValidation(requestBody, learnerUpdateJSON);

  const invalidStartTime = dataBody.start_time && !moment(dataBody.start_time).isValid();
  const invalidEndTime = dataBody.end_time && !moment(dataBody.end_time).isValid();

  const invalidDateTimeKey = invalidStartTime ? 'start_time' : 'end_time';

  if (!isRequestValid.isValid || invalidStartTime || invalidEndTime) {
    const code = 'LEARNER_JOURNEY_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: !isRequestValid.isValid ? isRequestValid.message : `Invalid ${invalidDateTimeKey} format` });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }
  // TODO: validate question_set_id, completed_question_ids & learner_id
  // TODO: conclude journey status on the basis of completed question ids

  const { learnerJourney } = await readLearnerJourney(dataBody.learner_id);

  const startTime = dataBody.start_time ? dataBody.start_time : learnerJourney!.start_time;

  if (startTime && dataBody.end_time && moment(startTime).isAfter(moment(dataBody.end_time))) {
    const code = 'LEARNER_JOURNEY_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: !isRequestValid.isValid ? isRequestValid.message : `end_time should be after start_time` });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  const transaction = await AppDataSource.transaction();

  await updateLearnerJourney(transaction, learnerJourney!.identifier, {
    ...dataBody,
    completed_question_ids: _.uniq([...(learnerJourney!.completed_question_ids || []), ...(dataBody.completed_question_ids || [])]),
  });

  await transaction.commit();

  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'learner journey updated successfully' } });
};

export default learnerJourneyUpdate;
