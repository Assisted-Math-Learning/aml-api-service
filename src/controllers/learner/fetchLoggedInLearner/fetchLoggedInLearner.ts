import { Request, Response } from 'express';
import { ResponseHandler } from '../../../utils/responseHandler';
import httpStatus from 'http-status';
import { getTenant } from '../../../services/tenant';

const fetchLoggedInLearner = async (req: Request, res: Response) => {
  const learner = (req as any).learner;

  const result = {
    username: learner!.username,
    identifier: learner!.identifier,
    taxonomy: learner!.taxonomy,
  };

  const tenant = await getTenant(learner.tenant_id);

  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Profile fetched successfully', data: { learner: result, tenant } } });
};

export default fetchLoggedInLearner;
