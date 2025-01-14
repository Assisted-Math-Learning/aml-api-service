import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { questionService } from '../../services/questionService';
import { amlError } from '../../types/amlError';
import { ResponseHandler } from '../../utils/responseHandler';
import { Status } from '../../enums/status';
import { User } from '../../models/users';
import { getUserByIdentifier } from '../../services/user';
import { UserTransformer } from '../../transformers/entity/user.transformer';

const publishQuestion = async (req: Request, res: Response) => {
  const apiId = _.get(req, 'id');
  const question_id = _.get(req, 'params.question_id');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');
  const loggedInUser: User | undefined = (req as any).user;

  const questionDetails = await questionService.getQuestionById(question_id, { status: Status.DRAFT });

  //validating Question is exist
  if (_.isEmpty(questionDetails)) {
    const code = 'QUESTION_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: `Question not exists` });
    throw amlError(code, 'Question not exists', 'NOT_FOUND', 404);
  }

  const [, affectedRows] = await questionService.publishQuestionById(question_id, loggedInUser!.identifier);

  const createdByUser = await getUserByIdentifier(affectedRows?.[0]?.created_by);

  const users = new UserTransformer().transformList(_.uniqBy([createdByUser, loggedInUser], 'identifier').filter((v) => !!v));

  logger.info({ apiId, question_id, message: 'Question Published successfully' });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Question Successfully Published', question: affectedRows?.[0] ?? {}, users } });
};

export default publishQuestion;
