import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ResponseHandler } from '../../utils/responseHandler';
import _ from 'lodash';
import { schemaValidation } from '../../services/validationService';
import listSkillJson from './listSkillsValidationSchema.json';
import { amlError } from '../../types/amlError';
import logger from '../../utils/logger';
import { getSkillList } from '../../services/skill';

const listSkills = async (req: Request, res: Response) => {
  const apiId = _.get(req, 'id');
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');
  const isRequestValid: Record<string, any> = schemaValidation(requestBody, listSkillJson);
  if (!isRequestValid.isValid) {
    const code = 'SKILL_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }
  const skillData = await getSkillList(requestBody.request);

  logger.info({ apiId, requestBody, message: `Skills are listed successfully` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: skillData });
};

export default listSkills;
