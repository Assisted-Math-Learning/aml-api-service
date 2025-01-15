import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ResponseHandler } from '../../utils/responseHandler';
import _ from 'lodash';
import { schemaValidation } from '../../services/validationService';
import listRepositoryJson from './listRepositoriesValidationSchema.json';
import { amlError } from '../../types/amlError';
import logger from '../../utils/logger';
import { Repository } from '../../models/repository';
import { getRepositoryIds } from '../../services/repositoryAssociation';
import { getRepositoryListByIds } from '../../services/repository';
import { tenantService } from '../../services/tenantService';

interface RepositoryResponse {
  repositories: Repository[];
  meta: {
    offset: any;
    limit: any;
    total: number;
  };
}

const listRepositories = async (req: Request, res: Response) => {
  const apiId = _.get(req, 'id');
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');
  const user = (req as any).user;
  let repositoryData: RepositoryResponse = { repositories: [], meta: { offset: 0, limit: 0, total: 0 } };

  const isRequestValid: Record<string, any> = schemaValidation(requestBody, listRepositoryJson);
  if (!isRequestValid.isValid) {
    const code = 'REPOSITORY_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  if (user.tenant_id) {
    const tenant = await tenantService.getTenant(user.tenant_id);
    if (tenant) {
      const repositoryIdentifiers = await getRepositoryIds(tenant.identifier);
      repositoryData = await getRepositoryListByIds(requestBody.request, repositoryIdentifiers);
    }
  } else {
    repositoryData = await getRepositoryListByIds(requestBody.request);
  }

  logger.info({ apiId, requestBody, message: `Repositories are listed successfully` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: repositoryData });
};

export default listRepositories;
