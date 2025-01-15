import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import repositorySchema from './repositoryCreateValidationSchema.json';
import httpStatus from 'http-status';
import { createRepositoryData } from '../../services/repository';
import { schemaValidation } from '../../services/validationService';
import { amlError } from '../../types/amlError';
import { ResponseHandler } from '../../utils/responseHandler';
import { v4 as uuidv4 } from 'uuid';
import { Status } from '../../enums/status';
import { tenantService } from '../../services/tenantService';

export const apiId = 'api.repository.create';

const createRepository = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const dataBody = _.get(req, 'body.request');
  const resmsgid = _.get(res, 'resmsgid');

  //validating the schema
  const isRequestValid: Record<string, any> = schemaValidation(requestBody, repositorySchema);
  if (!isRequestValid.isValid) {
    const code = 'REPOSITORY_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  // Extracting tenant names and checking if it exists
  const tenantName = dataBody.tenant.name;
  const { exists: tenantExists, tenant } = await tenantService.checkTenantNameExists(tenantName);
  if (!tenantExists || !tenant) {
    const code = 'TENANT_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: `Tenant not exists` });
    throw amlError(code, 'Tenant not exists', 'NOT_FOUND', 404);
  }

  // Create the tenant object
  const tenantObject = {
    id: tenant.id,
    name: tenant.name,
  };

  //creating a new repository
  const repositoryInsertData = _.assign(dataBody, {
    is_active: true,
    identifier: uuidv4(),
    status: Status.DRAFT,
    tenant: tenantObject,
    created_by: 'manual',
  });

  const repository = await createRepositoryData(repositoryInsertData);

  logger.info({ apiId, requestBody, message: `Repository Created Successfully with identifier` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Repository Successfully Created', identifier: repository.identifier } });
};

export default createRepository;
