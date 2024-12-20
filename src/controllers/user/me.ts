import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ResponseHandler } from '../../utils/responseHandler';
import { UserTransformer } from '../../transformers/entity/user.transformer';

const me = (req: Request, res: Response) => {
  const user = (req as any).user;
  const transformedUser = new UserTransformer(user).transform();
  ResponseHandler.successResponse(req, res, {
    status: httpStatus.OK,
    data: { message: 'User information retrieved successfully', data: { user: transformedUser } },
  });
};

export default me;
