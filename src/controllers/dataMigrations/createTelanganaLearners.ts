import { Request, Response } from 'express';
import { ResponseHandler } from '../../utils/responseHandler';
import httpStatus from 'http-status';

const createTelanganaLearners = async (req: Request, res: Response) => {
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { success: true } });
};

export default createTelanganaLearners;
