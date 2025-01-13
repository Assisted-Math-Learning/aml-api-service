import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { getContentById } from '../../services/content'; // Adjust import path as needed
import { amlError } from '../../types/amlError';
import { ResponseHandler } from '../../utils/responseHandler';
import { getFileUrlByFolderAndFileName } from '../../services/awsService';

const contentReadById = async (req: Request, res: Response) => {
  const apiId = _.get(req, 'id');
  const contentId = _.get(req, 'params.content_id');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');

  // Fetch content details by identifier
  const content = await getContentById(contentId);

  // Validate if content exists
  if (_.isEmpty(content)) {
    const code = 'CONTENT_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: `Content not exists` });
    throw amlError(code, 'Content not exists', 'NOT_FOUND', httpStatus.NOT_FOUND);
  }

  const mediaWithUrls = content?.media?.map((media) => ({ ...media, url: getFileUrlByFolderAndFileName(media.src, media.file_name) }));

  _.set(content, 'media', mediaWithUrls);

  // Log success and send response
  logger.info({ apiId, contentId, message: `Content read successfully` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { content } });
};

export default contentReadById;
