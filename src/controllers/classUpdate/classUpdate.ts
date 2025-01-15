import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { schemaValidation } from '../../services/validationService';
import logger from '../../utils/logger';
import classUpdateJson from './updateClassValidationSchema.json';
import { ResponseHandler } from '../../utils/responseHandler';
import { amlError } from '../../types/amlError';
import { classService } from '../../services/classService';

export const apiId = 'api.class.update';

//function for class update
const updateClass = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');
  const class_id = _.get(req, 'params.class_id');
  const dataBody = _.get(req, 'body.request');

  // Validate the request body against the schema
  const isRequestValid = schemaValidation(requestBody, classUpdateJson);
  if (!isRequestValid.isValid) {
    const code = 'CLASS_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  // Check if the class id exists
  const classData = await classService.getClassById(class_id);
  if (_.isEmpty(classData)) {
    const code = 'CLASS_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: 'Class does not exist' });
    throw amlError(code, 'Class does not exist', 'NOT_FOUND', 404);
  }

  const updatedData = {
    ...dataBody,
    updated_by: 'system',
  };

  // Update the class
  await classService.updateClassData(class_id, updatedData);

  // Respond with a success message
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Class Successfully Updated' } });
};

export default updateClass;
