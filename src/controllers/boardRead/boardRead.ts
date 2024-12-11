import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { amlError } from '../../types/amlError';
import { ResponseHandler } from '../../utils/responseHandler';
import { getBoard } from '../../services/board';

export const apiId = 'api.board.read';

const boardReadById = async (req: Request, res: Response) => {
  const boardId = _.get(req, 'params.board_id');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');

  // Fetch board details by identifier
  const boardDetails = await getBoard(boardId);

  // Validate if board exists
  if (_.isEmpty(boardDetails)) {
    const code = 'BOARD_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: `Board not exists` });
    throw amlError(code, 'Board not exists', 'NOT_FOUND', httpStatus.NOT_FOUND);
  }

  // Only send Supported Language for now
  const supported_lang = boardDetails.supported_lang;

  // Log success and send response
  logger.info({ apiId, boardId, message: `Board read successfully` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { supportedLanguages: supported_lang } });
};

export default boardReadById;
