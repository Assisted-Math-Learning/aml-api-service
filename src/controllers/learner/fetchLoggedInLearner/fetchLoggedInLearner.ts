import { Request, Response } from 'express';
import { ResponseHandler } from '../../../utils/responseHandler';
import httpStatus from 'http-status';
import { tenantService } from '../../../services/tenantService';

const fetchLoggedInLearner = async (req: Request, res: Response) => {
  const learner = (req as any).learner;

  const result = {
    username: learner!.username,
    identifier: learner!.identifier,
    taxonomy: learner!.taxonomy,
  };

  const tenant = await tenantService.getTenant(learner.tenant_id);

  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Profile fetched successfully', data: { learner: result, tenant } } });
};

export default fetchLoggedInLearner;
