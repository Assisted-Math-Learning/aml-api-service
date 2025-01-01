import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { questionSetService } from '../../services/questionSetService';
import { amlError } from '../../types/amlError';
import { ResponseHandler } from '../../utils/responseHandler';

export const apiId = 'api.questionSet.discard';

const discardQuestionSetById = async (req: Request, res: Response) => {
  const questionSet_id = _.get(req, 'params.question_set__id');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');

  const questionDetails = await questionSetService.getQuestionSetByIdAndStatus(questionSet_id);

  // Validating if question set exists
  if (_.isEmpty(questionDetails)) {
    const code = 'QUESTION_SET_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: `Question Set not exists` });
    throw amlError(code, 'Question Set not exists', 'NOT_FOUND', 404);
  }

  await questionSetService.discardQuestionSet(questionSet_id);

  logger.info({ apiId, msgid, resmsgid, questionSet_id, message: 'Question Set discarded successfully' });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Question Set discarded successfully' } });
};

export default discardQuestionSetById;
