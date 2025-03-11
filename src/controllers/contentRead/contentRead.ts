import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { getContentById } from '../../services/content'; // Adjust import path as needed
import { amlError } from '../../types/amlError';
import { ResponseHandler } from '../../utils/responseHandler';
import { getFileUrlByFolderAndFileName } from '../../services/awsService';
import { UserTransformer } from '../../transformers/entity/user.transformer';
import { userService } from '../../services/userService';

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

  const mediaWithUrls = content?.media?.filter((v) => !!v)?.map((media) => ({ ...media, url: getFileUrlByFolderAndFileName(media?.src, media?.fileName), language: media?.language || 'en' }));

  _.set(content, 'media', mediaWithUrls);

  const users = await userService.getUsersByIdentifiers(([content?.created_by, content?.updated_by] as any[]).filter((v) => !!v));

  const transformedUsers = new UserTransformer().transformList(users);

  // Log success and send response
  logger.info({ apiId, contentId, message: `Content read successfully` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { content, users: transformedUsers } });
};

export default contentReadById;
