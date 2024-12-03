import { NextFunction, Request } from 'express';
import { getLearnerByIdentifier } from '../services/learner';
import moment from 'moment';
import logger from '../utils/logger';
import { amlError } from '../types/amlError';
import httpStatus from 'http-status';
import lodash from 'lodash';

export const learnerAuth = async (req: Request, res: any, next: NextFunction) => {
  const apiId = lodash.get(req, 'id');
  const learnerId = lodash.get(req, ['session', 'learnerId']);
  if (!learnerId) {
    const code = 'UNAUTHENTICATED';
    logger.error({ code, apiId, message: 'Unauthenticated' });
    res.clearCookie('connect.sid');
    throw amlError(code, 'Unauthenticated', 'UNAUTHENTICATED', httpStatus.UNAUTHORIZED);
  }

  const learner = await getLearnerByIdentifier(learnerId);

  if (!learner) {
    const code = 'UNAUTHORIZED_ACCESS';
    logger.error({ code, apiId, message: 'Unauthorized Access' });
    res.clearCookie('connect.sid');
    throw amlError(code, 'Unauthorized Access', 'UNAUTHORIZED_ACCESS', httpStatus.UNAUTHORIZED);
  }

  const now = moment();
  if (req.session.cookie.expires && now.isAfter(moment(req.session.cookie.expires))) {
    req.session.destroy((err) => {
      if (err) return next(err);
      const code = 'SESSION_EXPIRED';
      logger.error({ code, apiId, message: 'Session Expired' });
      res.clearCookie('connect.sid');
      throw amlError(code, 'Session Expired', 'SESSION_EXPIRED', httpStatus.extra.iis.LOGIN_TIME_OUT);
    });
  }

  lodash.set(req, 'learner', learner);
  next();
};
