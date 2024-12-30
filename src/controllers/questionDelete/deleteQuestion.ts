import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import { questionService } from '../../services/questionService';
import { amlError } from '../../types/amlError';
import httpStatus from 'http-status';
import { ResponseHandler } from '../../utils/responseHandler';

export const apiId = 'api.question.delete';

const deleteQuestionById = async (req: Request, res: Response) => {
  const question_id = _.get(req, 'params.question_id');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');

  const questionDetails = await questionService.getQuestionById(question_id, { is_active: true });

  //validating tenant is exist
  if (_.isEmpty(questionDetails)) {
    const code = 'QUESTION_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: `Question not exists` });
    throw amlError(code, 'Question not exists', 'NOT_FOUND', 404);
  }

  await questionService.deleteQuestion(question_id);

  logger.info({ apiId, msgid, resmsgid, question_id, message: 'Question Deleted successfully' });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Question Deleted successfully' } });
};

export default deleteQuestionById;
