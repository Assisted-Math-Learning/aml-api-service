import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import questionSearch from './contentSearchValidationSchema.json';
import { schemaValidation } from '../../services/validationService';
import { amlError } from '../../types/amlError';
import { ResponseHandler } from '../../utils/responseHandler';
import { getContentList } from '../../services/content';
import { getFileUrlByFolderAndFileName } from '../../services/awsService';

export const searchContents = async (req: Request, res: Response) => {
  const apiId = _.get(req, 'id');
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');

  const isRequestValid: Record<string, any> = schemaValidation(requestBody, questionSearch);
  if (!isRequestValid.isValid) {
    const code = 'CONTENT_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  // Replace questionSetData with content
  const { contents, meta } = await getContentList(requestBody.request);

  const updatedContents = contents.reduce((agg: any[], curr) => {
    curr.media = (curr.media || [])?.map((media) => ({
      ...media,
      url: getFileUrlByFolderAndFileName(media.src, media.file_name),
    }));
    agg = [...agg, curr];
    return agg;
  }, []);

  logger.info({ apiId, requestBody, message: `Content is listed successfully` });

  // Update the response to return content instead of questionSetData
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { contents: updatedContents, meta } });
};
