import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { questionService } from '../../services/questionService';
import questionSearch from './questionSearchValidationSchema.json';
import { schemaValidation } from '../../services/validationService';
import { amlError } from '../../types/amlError';
import { ResponseHandler } from '../../utils/responseHandler';
import { getFileUrlByFolderAndFileName } from '../../services/awsService';
import { getUsersByIdentifiers } from '../../services/user';
import { UserTransformer } from '../../transformers/entity/user.transformer';

export const searchQuestions = async (req: Request, res: Response) => {
  const apiId = _.get(req, 'id');
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');

  const isRequestValid: Record<string, any> = schemaValidation(requestBody, questionSearch);
  if (!isRequestValid.isValid) {
    const code = 'QUESTION_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  const { questions, meta } = await questionService.getQuestionList(requestBody.request);

  const updatedQuestions = questions.map((question) => {
    if (question.question_body.question_image) {
      _.set(question.question_body, 'question_image_url', getFileUrlByFolderAndFileName(question.question_body.question_image.src, question.question_body.question_image.file_name));
    }
    return question;
  });

  const userIds = questions
    .reduce((agg: string[], curr) => {
      agg = [...agg, curr.created_by, curr?.updated_by as string];
      return agg;
    }, [])
    .filter((v) => !!v);

  const users = await getUsersByIdentifiers(userIds);

  const transformedUsers = new UserTransformer().transformList(users);

  logger.info({ apiId, requestBody, message: `Questions are listed successfully` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { questions: updatedQuestions, meta, users: transformedUsers } });
};
