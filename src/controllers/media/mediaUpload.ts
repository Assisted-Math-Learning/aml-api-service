import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import { ResponseHandler } from '../../utils/responseHandler';
import { amlError } from '../../types/amlError';
import httpStatus from 'http-status';
import { schemaValidation } from '../../services/validationService';
import mediaUploadSchema from './mediaUploadSchema.json';
import { uploadUrl } from '../../services/awsService';
import { appConfiguration } from '../../config';
import mime from 'mime-types';

export const apiId = 'api.media.upload';
const { mediaFolder } = appConfiguration;

const getMediaUploadURL = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const dataBody = _.get(req, 'body.request');
  const resmsgid = _.get(res, 'resmsgid');

  const isRequestValid: Record<string, any> = schemaValidation(requestBody, mediaUploadSchema);
  if (!isRequestValid.isValid) {
    const code = 'MEDIA_UPLOAD_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', httpStatus.BAD_REQUEST);
  }

  const signedUrls = await Promise.all(
    dataBody.map(async (file: any) => {
      const timeStamp = Date.now();
      const getSignedUrl = await uploadUrl(mediaFolder, file.category, `${timeStamp}/${file.fileName}`);
      if (getSignedUrl.error) {
        const code = 'SERVER_ERROR';
        logger.error({ code, apiId, msgid, resmsgid, message: getSignedUrl.message });
        throw amlError(code, getSignedUrl.message, 'INTERNAL_SERVER_ERROR', httpStatus.INTERNAL_SERVER_ERROR);
      }
      const mediaMetaData = getMediaMetaData(file.fileName);
      return {
        media: { fileName: file.fileName, src: `${mediaFolder}/${file.category}/${timeStamp}`, mimeType: mediaMetaData.mimeTye, mediaType: mediaMetaData.mediaType },
        url: getSignedUrl.url,
        expiresInSec: getSignedUrl.expiresInSec,
      };
    }),
  );

  logger.info({ apiId, requestBody, message: `signed urls for media upload created successfully ` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'success', signedUrls } });
};

const getMediaMetaData = (fileName: string) => {
  const fileMimeType = mime.lookup(fileName) || 'unknown';
  return { mimeTye: fileMimeType, mediaType: fileMimeType.split('/')[0] };
};

export default getMediaUploadURL;
