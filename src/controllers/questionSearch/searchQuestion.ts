import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { questionService } from '../../services/questionService';
import questionSearch from './questionSearchValidationSchema.json';
import { schemaValidation } from '../../services/validationService';
import { amlError } from '../../types/amlError';
import { ResponseHandler } from '../../utils/responseHandler';

export const apiId = 'api.question.search';

export const searchQuestions = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');

  const isRequestValid: Record<string, any> = schemaValidation(requestBody, questionSearch);
  if (!isRequestValid.isValid) {
    const code = 'QUESTION_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  const questionData = await questionService.getQuestionList(requestBody.request);

  logger.info({ apiId, requestBody, message: `Questions are listed successfully` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: questionData });
};
