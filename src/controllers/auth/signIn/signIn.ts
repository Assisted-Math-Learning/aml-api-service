import { Request, Response } from 'express';
import * as _ from 'lodash';
import { schemaValidation } from '../../../services/validationService';
import signInJson from './signInValidationSchema.json';
import logger from '../../../utils/logger';
import { amlError } from '../../../types/amlError';
import bcrypt from 'bcrypt';
import { ResponseHandler } from '../../../utils/responseHandler';
import httpStatus from 'http-status';
import { tenantService } from '../../../services/tenantService';
import { learnerService } from '../../../services/learnerService';
import { classService } from '../../../services/classService';
import { BOARD_ID_MAPPING, TENANT_ID_MAPPING } from './signin.helper';
import * as uuid from 'uuid';
import { LearnerTransformer } from '../../../transformers/entity/learner.transformer';
import { boardService } from '../../../services/boardService';

const signIn = async (req: Request, res: Response) => {
  const apiId = _.get(req, 'id');
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const dataBody = _.get(req, 'body.request');
  const resmsgid = _.get(res, 'resmsgid');

  const isRequestValid: Record<string, any> = schemaValidation(requestBody, signInJson);

  if (!isRequestValid.isValid) {
    const code = 'SIGN_IN_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  const { username, password, class_id, tenant_name } = dataBody;

  const tenantId = (TENANT_ID_MAPPING as any)[tenant_name];
  const boardId = (BOARD_ID_MAPPING as any)[tenant_name];

  const tenant = await tenantService.getTenant(tenantId);

  if (!tenant) {
    const code = 'TENANT_NOT_FOUND';
    const message = 'Invalid tenant';
    logger.error({ code, apiId, msgid, resmsgid, message: message });
    throw amlError(code, message, 'NOT_FOUND', 404);
  }

  let learner = await learnerService.getLearnerByUserNameAndTenantId(username, tenantId);

  if (learner) {
    const passwordMatch = await bcrypt.compare(password, learner.password);

    if (!passwordMatch) {
      const code = 'INVALID_CREDENTIALS';
      const message = 'Incorrect password';
      logger.error({ code, apiId, msgid, resmsgid, message: message });
      throw amlError(code, message, 'BAD_REQUEST', 400);
    }
  } else {
    const classEntity = await classService.getClassById(class_id);
    if (!classEntity) {
      const code = 'CLASS_NOT_FOUND';
      const message = 'Invalid class';
      logger.error({ code, apiId, msgid, resmsgid, message: message });
      throw amlError(code, message, 'NOT_FOUND', 404);
    }

    const board = await boardService.getBoardByIdentifier(boardId);
    if (!board) {
      const code = 'BOARD_NOT_FOUND';
      const message = 'Invalid board';
      logger.error({ code, apiId, msgid, resmsgid, message: message });
      throw amlError(code, message, 'NOT_FOUND', 404);
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    learner = await learnerService.create({
      identifier: uuid.v4(),
      username,
      password: encryptedPassword,
      tenant_id: tenantId,
      board_id: boardId,
      class_id: class_id,
      created_by: 'sign-in-api',
    });
  }

  _.set(req, ['session', 'learnerId'], learner.identifier);

  const result = new LearnerTransformer().transform(learner);

  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Login successful', data: { learner: result, tenant } } });
};

export default signIn;
