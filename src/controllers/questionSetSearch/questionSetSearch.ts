import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import questionSearch from './questionSetSearchValidationSchema.json';
import { schemaValidation } from '../../services/validationService';
import { amlError } from '../../types/amlError';
import { ResponseHandler } from '../../utils/responseHandler';
import { questionSetService } from '../../services/questionSetService';
import { boardService } from '../../services/boardService';

export const searchQuestionSets = async (req: Request, res: Response) => {
  const apiId = _.get(req, 'id');
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');

  const isRequestValid: Record<string, any> = schemaValidation(requestBody, questionSearch);
  if (!isRequestValid.isValid) {
    const code = 'QUESTIONSET_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  const { meta, question_sets } = await questionSetService.getQuestionSetList(requestBody.request);

  const boardIds = _.uniq(question_sets.map((qs) => qs.taxonomy.board.identifier));

  const boards = await boardService.getBoardsByIdentifiers(boardIds);

  logger.info({ apiId, requestBody, message: `Question Sets are listed successfully` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { question_sets, boards, meta } });
};
