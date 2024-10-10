import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import logger from '../../../utils/logger';
import { ResponseHandler } from '../../../utils/responseHandler';
import { amlError } from '../../../types/amlError';
import { readLearnerJourney } from '../../../services/learnerJourney';

export const apiId = 'api.learner.journey.read';

const learnerJourneyRead = async (req: Request, res: Response) => {
  const learner_id = _.get(req, 'params.learner_id');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');

  // TODO: validate learner_id

  const { learnerJourney } = await readLearnerJourney(learner_id);

  if (_.isEmpty(learnerJourney)) {
    const code = 'LEARNER_JOURNEY_NOT_FOUND';
    const message = 'learner Journey does not exist for the requested learner';
    logger.error({ code, apiId, msgid, resmsgid, message: message });
    throw amlError(code, message, 'NOT_FOUND', 404);
  }

  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'learner journey Read Successfully', data: learnerJourney } });
};

export default learnerJourneyRead;
