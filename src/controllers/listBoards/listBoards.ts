import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ResponseHandler } from '../../utils/responseHandler';
import { boardService } from '../../services/boardService';
import _ from 'lodash';
import { schemaValidation } from '../../services/validationService';
import listBoardJson from './listBoardsValidationSchema.json';
import { amlError } from '../../types/amlError';
import logger from '../../utils/logger';

const listBoards = async (req: Request, res: Response) => {
  const apiId = _.get(req, 'id');
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');
  const isRequestValid: Record<string, any> = schemaValidation(requestBody, listBoardJson);

  if (!isRequestValid.isValid) {
    const code = 'BOARD_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }
  const boardsData = await boardService.getBoardList(requestBody.request);

  logger.info({ apiId, requestBody, message: `Boards are listed successfully` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: boardsData });
};

export default listBoards;
