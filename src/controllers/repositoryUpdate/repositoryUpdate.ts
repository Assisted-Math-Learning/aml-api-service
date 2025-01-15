import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { getRepositoryById, updateRepository } from '../../services/repository';
import { schemaValidation } from '../../services/validationService';
import logger from '../../utils/logger';
import repositoryUpdateSchema from './repositoryUpdateValidationSchema.json'; // Ensure this schema file is defined correctly
import { amlError } from '../../types/amlError';
import { ResponseHandler } from '../../utils/responseHandler';
import { tenantService } from '../../services/tenantService';

export const apiId = 'api.repository.update';

const repositoryUpdate = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const repository_id = _.get(req, 'params.repository_id'); // Assuming identifier is used
  const dataBody = _.get(req, 'body.request');
  const resmsgid = _.get(res, 'resmsgid');

  // Validating the update schema
  const isRequestValid = schemaValidation(requestBody, repositoryUpdateSchema);
  if (!isRequestValid.isValid) {
    const code = 'REPOSITORY_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  // Validate repository existence
  const repository = await getRepositoryById(repository_id);
  if (_.isEmpty(repository)) {
    const code = 'REPOSITORY_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: `Repository does not exist with identifier: ${repository_id}` });
    throw amlError(code, 'Repository does not exist', 'NOT_FOUND', 404);
  }

  // Initialize an updated body
  const updatedDataBody: any = {};

  // Extract and check tenant
  if (dataBody.tenant) {
    const tenantName = dataBody.tenant.name;
    const { exists: tenantExists, tenant } = await tenantService.checkTenantNameExists(tenantName);
    if (!tenantExists || !tenant) {
      const code = 'TENANT_NOT_EXISTS';
      logger.error({ code, apiId, msgid, resmsgid, message: `Tenant not exists` });
      throw amlError(code, 'Tenant not exists', 'NOT_FOUND', 404);
    }
    updatedDataBody.tenant = { id: tenant.id, name: tenant.name }; // Create tenant object
  }

  const mergedData = _.merge({}, repository, dataBody, updatedDataBody);

  // Update Repository
  await updateRepository(repository_id, mergedData);

  logger.info({ apiId, msgid, resmsgid, repository_id, message: 'Repository successfully updated' });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Repository successfully updated' } });
};

export default repositoryUpdate;
