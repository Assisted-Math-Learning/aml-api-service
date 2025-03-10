import { Request, Response } from 'express';
import * as _ from 'lodash';
import { schemaValidation } from '../../../services/validationService';
import loginJson from './loginValidationSchema.json';
import logger from '../../../utils/logger';
import { amlError } from '../../../types/amlError';
import bcrypt from 'bcrypt';
import { ResponseHandler } from '../../../utils/responseHandler';
import httpStatus from 'http-status';
import { tenantService } from '../../../services/tenantService';
import { learnerService } from '../../../services/learnerService';
import { LearnerTransformer } from '../../../transformers/entity/learner.transformer';

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

  const learner = await learnerService.getLearnerByUserName(username, true);

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

  const result = new LearnerTransformer().transform(learner);

  const tenant = await tenantService.getTenant(learner.tenant_id);

  ResponseHandler.successResponse(req, res, {
    status: httpStatus.OK,
    data: { message: 'Login successful', data: { learner: result, tenant, session_expires_at: req.session.cookie.expires, login_page_url: '/login' } },
  });
};

export default login;
