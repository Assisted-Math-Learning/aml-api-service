import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { getQuestionById, publishQuestionById } from '../../services/question';
import { amlError } from '../../types/amlError';
import { ResponseHandler } from '../../utils/responseHandler';
import { Status } from '../../enums/status';

export const apiId = 'api.question.publish';

const publishQuestion = async (req: Request, res: Response) => {
  const question_id = _.get(req, 'params.question_id');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');

  const questionDetails = await getQuestionById(question_id, { status: Status.DRAFT });

  //validating Question is exist
  if (_.isEmpty(questionDetails)) {
    const code = 'QUESTION_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: `Question not exists` });
    throw amlError(code, 'Question not exists', 'NOT_FOUND', 404);
  }

  await publishQuestionById(question_id);

  logger.info({ apiId, question_id, message: 'Question Published successfully' });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Question Successfully Published' } });
};

export default publishQuestion;
