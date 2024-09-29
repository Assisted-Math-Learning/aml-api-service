import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { getTenant } from '../../services/tenant';
import { ResponseHandler } from '../../utils/responseHandler';
import { amlError } from '../../types/amlError';

export const apiId = 'api.tenant.read';

const readTeantById = async (req: Request, res: Response) => {
  const tenant_id = _.get(req, 'params.tenant_id');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');

  const tenant = await getTenant(tenant_id);

  //validating tenant is exist
  if (_.isEmpty(tenant)) {
    const code = 'TENANT_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: `Tenant not exists` });
    throw amlError(code, 'Tenant not exists', 'NOT_FOUND', 404);
  }

  logger.info({ apiId, msgid, resmsgid, message: `Tenant Read Successfully` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: tenant });
};

export default readTeantById;
