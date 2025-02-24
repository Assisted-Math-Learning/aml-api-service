import { Request, Response } from 'express';
import { ResponseHandler } from '../../../utils/responseHandler';
import httpStatus from 'http-status';
import { tenantService } from '../../../services/tenantService';
import { LearnerTransformer } from '../../../transformers/entity/learner.transformer';

const fetchLoggedInLearner = async (req: Request, res: Response) => {
  const learner = (req as any).learner;

  const result = new LearnerTransformer().transform(learner);

  const tenant = await tenantService.getTenant(learner.tenant_id);

  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Profile fetched successfully', data: { learner: result, tenant } } });
};

export default fetchLoggedInLearner;
