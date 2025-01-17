import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { ResponseHandler } from '../../utils/responseHandler';
import { listLearners, updateLearner } from '../../services/learner';
import { amlError } from '../../types/amlError';

export const learnerTaxonomyToColumns = async (req: Request, res: Response) => {
  const apiId = _.get(req, 'id');
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');

  const allLearners = await listLearners();

  if (allLearners.length === 0) {
    logger.info({ apiId, requestBody, message: `No Learners found` });
    ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'No Learners found' } });
    return;
  }

  const updatePromises = allLearners.map((learner) => {
    const taxonomyData = learner?.taxonomy;
    const updateData = {
      board_id: taxonomyData?.board?.identifier ?? null,
      class_id: taxonomyData?.class?.identifier ?? null,
      name: learner.username,
    };
    return updateLearner(learner.id, updateData);
  });

  const results = await Promise.allSettled(updatePromises);

  const failures = results.filter((result) => result.status === 'rejected');
  if (failures.length > 0) {
    const code = 'MIGRATION_FAILED';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: `Migrations failed for ${failures.length} learners` });
    throw amlError(code, `Migrations failed for ${failures.length} learners'`, 'INTERNAL_SERVER_ERROR', 500);
  }

  logger.info({ apiId, requestBody, message: `Repositories are listed successfully` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Migrated learner taxonomy to columns successfully' } });
};
