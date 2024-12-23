import { Request, Response } from 'express';
import * as _ from 'lodash';
import logger from '../../../utils/logger';
import { amlError } from '../../../types/amlError';
import { readLearnerJourney } from '../../../services/learnerJourney';
import { LearnerJourneyStatus } from '../../../enums/learnerJourneyStatus';
import { ResponseHandler } from '../../../utils/responseHandler';
import { getAllQuestionLevelDataByLearnerIdAndQuestionSetId } from '../../../services/learnerProficiencyData';
import httpStatus from 'http-status';

export const apiId = 'api.learner.journey.latest-responses';

const leanerJourneyLatestResponseById = async (req: Request, res: Response) => {
  const learnerId = _.get(req, 'params.learner_id');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');

  const learner = (req as any).learner;

  if (learner.identifier !== learnerId) {
    const code = 'LEARNER_DOES_NOT_EXIST';
    logger.error({ code, apiId, msgid, resmsgid, message: 'Learner does not exist' });
    throw amlError(code, 'Learner does not exist', 'NOT_FOUND', 404);
  }

  const { learnerJourney } = await readLearnerJourney(learnerId);

  if (_.isEmpty(learnerJourney) || (learnerJourney.status === LearnerJourneyStatus.IN_PROGRESS && learnerJourney.completed_question_ids.length === 0)) {
    ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Learner journey latest responses not found', data: [] } });
    return;
  }

  const questionSetId = learnerJourney.question_set_id;
  const completedQuestionIds = learnerJourney.completed_question_ids;

  const learnerProficiencyQuestionLevelData = await getAllQuestionLevelDataByLearnerIdAndQuestionSetId(learnerId, questionSetId);

  const learnerResponses = learnerProficiencyQuestionLevelData
    .filter((datum: any) => {
      return completedQuestionIds.includes(datum.question_id);
    })
    .map((datum: any) => ({
      question_id: datum.question_id,
      question_set_id: datum.question_set_id,
      learner_response: datum.learner_response,
    }));

  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Learner journey latest responses read', data: learnerResponses } });
};

export default leanerJourneyLatestResponseById;
