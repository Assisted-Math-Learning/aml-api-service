import { Request, Response } from 'express';
import * as _ from 'lodash';
import { schemaValidation } from '../../../services/validationService';
import loginJson from './loginValidationSchema.json';
import logger from '../../../utils/logger';
import { amlError } from '../../../types/amlError';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ResponseHandler } from '../../../utils/responseHandler';
import httpStatus from 'http-status';
import { getUserByEmail } from '../../../services/user';
import { appConfiguration } from '../../../config';
import { UserTransformer } from '../../../transformers/entity/user.transformer';
import { getTenant } from '../../../services/tenant';

const { aml_jwt_secret_key } = appConfiguration;

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

  const { email, password } = dataBody;

  const user = await getUserByEmail(email);

  if (!user || _.isEmpty(user)) {
    const code = 'USER_NOT_FOUND';
    const message = 'Invalid Email';
    logger.error({ code, apiId, msgid, resmsgid, message });
    throw amlError(code, message, 'NOT_FOUND', 404);
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    const code = 'INVALID_CREDENTIALS';
    const message = 'Incorrect password';
    logger.error({ code, apiId, msgid, resmsgid, message });
    throw amlError(code, message, 'BAD_REQUEST', 400);
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    aml_jwt_secret_key,
  );

  const result = {
    user: new UserTransformer(user).transform(),
    token,
  };

  if (user.tenant_id) {
    const tenant = await getTenant(user.tenant_id);
    if (tenant) {
      _.set(result, 'tenant', tenant);
    }
  }

  ResponseHandler.successResponse(req, res, {
    status: httpStatus.OK,
    data: { message: 'Login successful', data: result },
  });
};

export default login;
