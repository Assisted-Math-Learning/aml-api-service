import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import tenantCreateJson from './createTenantValidationSchema.json';
import httpStatus from 'http-status';
import { createTenantData } from '../../services/tenant';
import { schemaValidation } from '../../services/validationService';
import * as uuid from 'uuid';
import { getBoards } from '../../services/board';
import { Status } from '../../enums/status';
import { ResponseHandler } from '../../utils/responseHandler';
import { amlError } from '../../types/amlError';

export const apiId = 'api.tenant.create';

const createTenant = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const dataBody = _.get(req, 'body.request');
  const resmsgid = _.get(res, 'resmsgid');

  //validating the schema
  const isRequestValid: Record<string, any> = schemaValidation(requestBody, tenantCreateJson);
  if (!isRequestValid.isValid) {
    const code = 'TENANT_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  const boards = await getBoards(dataBody.board_id);

  if (boards.length !== dataBody.board_id.length) {
    const code = 'BOARD_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: 'Board do not exists' });
    throw amlError(code, 'Board do not exists', 'NOT_FOUND', 404);
  }

  const tenantInsertData = {
    ...dataBody,
    identifier: uuid.v4(),
    status: Status.LIVE,
    created_by: 'system',
    is_active: true,
  };

  const createNewTenant = await createTenantData(tenantInsertData);

  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Tenant Successfully Created', identifier: createNewTenant.dataValues.identifier } });
};

export default createTenant;
