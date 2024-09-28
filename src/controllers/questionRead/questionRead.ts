import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { getQuestionById } from '../../services/question';
import { amlError } from '../../types/amlError';
import { ResponseHandler } from '../../utils/responseHandler';

export const apiId = 'api.question.read';

const readQuestionById = async (req: Request, res: Response) => {
  const question_id = _.get(req, 'params.question_id');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');

  const questionDetails = await getQuestionById(question_id);

  //validating Question is exist
  if (_.isEmpty(questionDetails)) {
    const code = 'QUESTION_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: `Question not exists with id:${question_id}` });
    throw amlError(code, 'Question not exists', 'NOT_FOUND', 404);
  }
  logger.info({ apiId, question_id, message: `question read Successfully` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: questionDetails });
};

export default readQuestionById;
