import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ResponseHandler } from '../../utils/responseHandler';
import _ from 'lodash';
import { schemaValidation } from '../../services/validationService';
import listClassJson from './listClassesValidationSchema.json';
import { amlError } from '../../types/amlError';
import logger from '../../utils/logger';
import { getClassList } from '../../services/class';

const listClasses = async (req: Request, res: Response) => {
  const apiId = _.get(req, 'id');
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');
  const isRequestValid: Record<string, any> = schemaValidation(requestBody, listClassJson);
  if (!isRequestValid.isValid) {
    const code = 'CLASS_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }
  const classData = await getClassList(requestBody.request);

  logger.info({ apiId, requestBody, message: `Classes are listed successfully` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: classData });
};

export default listClasses;
