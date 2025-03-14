import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { questionService } from '../../services/questionService';
import { amlError } from '../../types/amlError';
import { ResponseHandler } from '../../utils/responseHandler';

export const apiId = 'api.question.discard';

const discardQuestionById = async (req: Request, res: Response) => {
  const question_id = _.get(req, 'params.question_id');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');

  const questionDetails = await questionService.getQuestionById(question_id);

  //validating Question is exist
  if (_.isEmpty(questionDetails)) {
    const code = 'QUESTION_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: `Question not exists` });
    throw amlError(code, 'Question not exists', 'NOT_FOUND', 404);
  }

  await questionService.discardQuestion(question_id);

  logger.info({ apiId, msgid, resmsgid, question_id, message: 'Question Discarded successfully' });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Question Discard successfully' } });
};

export default discardQuestionById;
