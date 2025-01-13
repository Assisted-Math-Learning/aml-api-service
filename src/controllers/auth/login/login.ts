import { Request, Response } from 'express';
import * as _ from 'lodash';
import { schemaValidation } from '../../../services/validationService';
import loginJson from './loginValidationSchema.json';
import logger from '../../../utils/logger';
import { amlError } from '../../../types/amlError';
import { getLearnerByUserName } from '../../../services/learner';
import bcrypt from 'bcrypt';
import { ResponseHandler } from '../../../utils/responseHandler';
import httpStatus from 'http-status';
import { getTenant } from '../../../services/tenant';

const login = async (req: Request, res: Response) => {
  const apiId = _.get(req, 'id');
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const dataBody = _.get(req, 'body.request');
  const resmsgid = _.get(res, 'resmsgid');

  const isRequestValid: Record<string, any> = schemaValidation(requestBody, loginJson);

  if (!isRequestValid.isValid) {
    const code = 'LOGIN_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  const { username, password } = dataBody;

  const learner = await getLearnerByUserName(username);

  if (!learner || _.isEmpty(learner)) {
    const code = 'LEARNER_NOT_FOUND';
    const message = 'Invalid username';
    logger.error({ code, apiId, msgid, resmsgid, message: message });
    throw amlError(code, message, 'NOT_FOUND', 404);
  }

  const passwordMatch = await bcrypt.compare(password, learner.password);

  if (!passwordMatch) {
    const code = 'INVALID_CREDENTIALS';
    const message = 'Incorrect password';
    logger.error({ code, apiId, msgid, resmsgid, message: message });
    throw amlError(code, message, 'BAD_REQUEST', 400);
  }

  _.set(req, ['session', 'learnerId'], learner.identifier);

  const result = {
    username: learner.username,
    identifier: learner.identifier,
    taxonomy: learner.taxonomy,
  };

  const tenant = await getTenant(learner.tenant_id);

  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Login successful', data: { learner: result, tenant } } });
};

export default login;
