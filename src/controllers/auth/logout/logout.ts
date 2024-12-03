import { Request, Response } from 'express';
import logger from '../../../utils/logger';
import { amlError } from '../../../types/amlError';
import { ResponseHandler } from '../../../utils/responseHandler';
import httpStatus from 'http-status';
import _ from 'lodash';

const logout = (req: Request, res: Response) => {
  const apiId = _.get(req, 'id');

  req.session.destroy((err) => {
    if (err) {
      const code = 'SERVER_ERROR';
      const message = 'Logout Failed';
      logger.error({ code, apiId, message: message });
      throw amlError(code, message, 'SERVER_ERROR', 500);
    }
    res.clearCookie('connect.sid');
    ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Logout successful' } });
  });
};

export default logout;
