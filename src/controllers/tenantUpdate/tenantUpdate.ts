import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { schemaValidation } from '../../services/validationService';
import logger from '../../utils/logger';
import tenantUpdateJson from './updateTenantValidationSchema.json';
import { boardService } from '../../services/boardService';
import { ResponseHandler } from '../../utils/responseHandler';
import { amlError } from '../../types/amlError';
import { tenantService } from '../../services/tenantService';

export const apiId = 'api.tenant.update';

const updateTenant = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');
  const tenant_id = _.get(req, 'params.tenant_id');
  const dataBody = _.get(req, 'body.request');

  const isRequestValid = schemaValidation(requestBody, tenantUpdateJson);
  if (!isRequestValid.isValid) {
    const code = 'TENANT_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  // Validate tenant existence
  const tenant = await tenantService.getTenant(tenant_id);
  if (_.isEmpty(tenant)) {
    const code = 'TENANT_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: 'Tenant does not exist' });
    throw amlError(code, 'Tenant does not exists', 'NOT_FOUND', 404);
  }

  // Validate boards
  if (dataBody.board_id) {
    const boards = await boardService.getBoards(dataBody.board_id);

    if (boards.length !== dataBody.board_id.length) {
      const code = 'BOARD_NOT_EXISTS';
      logger.error({ code, apiId, msgid, resmsgid, requestBody, message: 'Some boards does not exist' });
      throw amlError(code, 'Board do not exists', 'NOT_FOUND', 404);
    }
  }

  const mergedData = _.merge({}, tenant, dataBody);

  // Update the tenant
  await tenantService.updateTenantData(tenant_id, mergedData);

  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Tenant Successfully Updated' } });
};

export default updateTenant;
