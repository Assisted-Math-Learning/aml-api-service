import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { questionService } from '../../services/questionService';
import { amlError } from '../../types/amlError';
import { ResponseHandler } from '../../utils/responseHandler';
import { getFileUrlByFolderAndFileName } from '../../services/awsService';
import { getUsersByIdentifiers } from '../../services/user';
import { UserTransformer } from '../../transformers/entity/user.transformer';

const readQuestionById = async (req: Request, res: Response) => {
  const apiId = _.get(req, 'id');
  const question_id = _.get(req, 'params.question_id');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');

  const question = await questionService.getQuestionById(question_id);

  //validating Question is exist
  if (_.isEmpty(question)) {
    const code = 'QUESTION_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: `Question not exists with id:${question_id}` });
    throw amlError(code, 'Question not exists', 'NOT_FOUND', 404);
  }
  logger.info({ apiId, question_id, message: `question read Successfully` });

  if (question?.question_body.question_image) {
    _.set(question.question_body, 'question_image_url', getFileUrlByFolderAndFileName(question.question_body.question_image.src, question.question_body.question_image.file_name));
  }

  const users = await getUsersByIdentifiers(([question?.created_by, question?.updated_by] as any[]).filter((v) => !!v));

  const transformedUsers = new UserTransformer().transformList(users);

  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { question, users: transformedUsers } });
};

export default readQuestionById;
