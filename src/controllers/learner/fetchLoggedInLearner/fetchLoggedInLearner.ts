import { Request, Response } from 'express';
import { ResponseHandler } from '../../../utils/responseHandler';
import httpStatus from 'http-status';
import { tenantService } from '../../../services/tenantService';
import { LearnerTransformer } from '../../../transformers/entity/learner.transformer';
import _ from 'lodash';
import { TENANT_ID_MAPPING } from '../../auth/signIn/signin.helper';

const fetchLoggedInLearner = async (req: Request, res: Response) => {
  const learner = (req as any).learner;

  const result = new LearnerTransformer().transform(learner);

  const tenant = await tenantService.getTenant(learner.tenant_id);

  let loginPage = '/login';

  if (tenant) {
    const tenantName = tenant?.name.en;
    const tenantNameTokens = tenantName?.split(' ').map((t) => _.lowerCase(t));
    const tenantNameSlug = tenantNameTokens[0].concat(
      tenantNameTokens
        .slice(1)
        .map((t) => _.capitalize(t))
        .join(''),
    );
    if (Object.keys(TENANT_ID_MAPPING).includes(tenantNameSlug)) {
      loginPage = `/signin/${tenantNameSlug}`;
    }
  }

  ResponseHandler.successResponse(req, res, {
    status: httpStatus.OK,
    data: { message: 'Profile fetched successfully', data: { learner: result, tenant, session_expires_at: req.session.cookie.expires, login_page_url: loginPage } },
  });
};

export default fetchLoggedInLearner;
