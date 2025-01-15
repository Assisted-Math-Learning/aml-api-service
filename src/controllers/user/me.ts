import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ResponseHandler } from '../../utils/responseHandler';
import { UserTransformer } from '../../transformers/entity/user.transformer';
import * as _ from 'lodash';
import { tenantService } from '../../services/tenantService';

const me = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = {
    user: new UserTransformer().transform(user),
  };

  if (user.tenant_id) {
    const tenant = await tenantService.getTenant(user.tenant_id);
    if (tenant) {
      _.set(result, 'tenant', tenant);
    }
  }
  ResponseHandler.successResponse(req, res, {
    status: httpStatus.OK,
    data: { message: 'User information retrieved successfully', data: result },
  });
};

export default me;
