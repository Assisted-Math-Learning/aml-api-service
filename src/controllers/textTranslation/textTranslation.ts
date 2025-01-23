import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { amlError } from '../../types/amlError';
import { ResponseHandler } from '../../utils/responseHandler';
import { schemaValidation } from '../../services/validationService';
import textTranslationValidationSchema from './textTranslationValidationSchema.json';
import { translationService } from '../../services/translationService';

const textTranslation = async (req: Request, res: Response) => {
  const apiId = _.get(req, 'id');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');
  const requestBody = _.get(req, 'body');
  const dataBody = _.get(req, 'body.request');

  const isRequestValid = schemaValidation(requestBody, textTranslationValidationSchema);

  if (!isRequestValid.isValid) {
    const code = 'TEXT_TRANSLATION_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', httpStatus.BAD_REQUEST);
  }

  const input_string = _.get(dataBody, 'input_string');
  const target_language = _.get(dataBody, 'target_language');
  const source_language = _.get(dataBody, 'source_language', 'en');

  const [translatedData, error] = await translationService.generateTranslation(input_string, source_language, target_language);

  if (error) {
    const code = 'TEXT_TRANSLATION_FAILED';
    logger.error({ code, apiId, msgid, resmsgid, message: error });
    throw amlError(code, error, 'INTERNAL_SERVER_ERROR', httpStatus.INTERNAL_SERVER_ERROR);
  }

  logger.info({ apiId, msgid, resmsgid, message: `Text translated successfully` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: translatedData });
};

export default textTranslation;
