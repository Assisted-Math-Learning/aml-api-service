import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { getTenantSearch } from '../../services/tenant';
import { schemaValidation } from '../../services/validationService';
import logger from '../../utils/logger';
import tenantSearchJson from './searchTenantValidationSchema.json';
import { amlError } from '../../types/amlError';
import { ResponseHandler } from '../../utils/responseHandler';

export const apiId = 'api.tenant.search';

const searchTenants = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');

  // Validate the request body
  const isRequestValid = schemaValidation(requestBody, tenantSearchJson);
  if (!isRequestValid.isValid) {
    const code = 'TENANT_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  // Search for tenants
  const tenantData = await getTenantSearch(requestBody.request);

  logger.info({ apiId, requestBody, message: `Tenants are searched successfully` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: tenantData });
};

export default searchTenants;
