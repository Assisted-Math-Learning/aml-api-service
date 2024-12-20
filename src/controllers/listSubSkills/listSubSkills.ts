import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ResponseHandler } from '../../utils/responseHandler';
import _ from 'lodash';
import { schemaValidation } from '../../services/validationService';
import listSubSkillJson from './listSubSkilslValidationSchema.json';
import { amlError } from '../../types/amlError';
import logger from '../../utils/logger';
import { getSubSkillList } from '../../services/subSkill';

const listSubSkills = async (req: Request, res: Response) => {
  const apiId = _.get(req, 'id');
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');
  const isRequestValid: Record<string, any> = schemaValidation(requestBody, listSubSkillJson);
  if (!isRequestValid.isValid) {
    const code = 'SUB_SKILL_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }
  const subSkillData = await getSubSkillList(requestBody.request);

  logger.info({ apiId, requestBody, message: `Sub Skills are listed successfully` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: subSkillData });
};

export default listSubSkills;
