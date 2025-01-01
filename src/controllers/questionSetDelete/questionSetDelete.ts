import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import { questionSetService } from '../../services/questionSetService';
import { amlError } from '../../types/amlError';
import httpStatus from 'http-status';
import { ResponseHandler } from '../../utils/responseHandler';

export const apiId = 'api.questionSet.delete';

const deleteQuestionSetById = async (req: Request, res: Response) => {
  const questionSet_id = _.get(req, 'params.question_set_id');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');

  const questionSetDetails = await questionSetService.getQuestionSetByIdAndStatus(questionSet_id, { is_active: true });
  // Validating if question set exists
  if (_.isEmpty(questionSetDetails)) {
    const code = 'QUESTION_SET_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: `Question Set not exists` });
    throw amlError(code, 'Question Set not exists', 'NOT_FOUND', 404);
  }

  await questionSetService.deleteQuestionSet(questionSet_id);

  logger.info({ apiId, msgid, resmsgid, questionSet_id, message: 'Question Set deleted successfully' });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Question Set deleted successfully' } });
};

export default deleteQuestionSetById;
