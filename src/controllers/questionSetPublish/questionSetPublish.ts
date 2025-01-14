import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { questionSetService } from '../../services/questionSetService';
import { amlError } from '../../types/amlError';
import { ResponseHandler } from '../../utils/responseHandler';
import { Status } from '../../enums/status';
import { getUserByIdentifier } from '../../services/user';
import { UserTransformer } from '../../transformers/entity/user.transformer';
import { User } from '../../models/users';

const publishQuestionSet = async (req: Request, res: Response) => {
  const apiId = _.get(req, 'id');
  const questionSet_id = _.get(req, 'params.question_set_id');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');
  const loggedInUser: User | undefined = (req as any).user;

  const questionSetDetails = await questionSetService.getQuestionSetByIdAndStatus(questionSet_id, { status: Status.DRAFT });

  //validating if question set exists
  if (_.isEmpty(questionSetDetails)) {
    const code = 'QUESTION_SET_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: `Question Set not exists` });
    throw amlError(code, 'Question Set not exists', 'NOT_FOUND', 404);
  }

  const [, affectedRows] = await questionSetService.publishQuestionSetById(questionSet_id, loggedInUser!.identifier);

  const createdByUser = await getUserByIdentifier(affectedRows?.[0]?.created_by);

  const users = new UserTransformer().transformList(_.uniqBy([createdByUser, loggedInUser], 'identifier').filter((v) => !!v));

  logger.info({ apiId, questionSet_id, message: 'Question Set Published successfully' });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Question Set Successfully Published', question_set: affectedRows?.[0] ?? {}, users } });
};

export default publishQuestionSet;
