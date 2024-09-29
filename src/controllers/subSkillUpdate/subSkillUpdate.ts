import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { getSubSkill, updateSubSkillData } from '../../services/subSkill';
import { schemaValidation } from '../../services/validationService';
import logger from '../../utils/logger';
import subSkillUpdateJson from './updateSubSkillValidationSchema.json';
import { ResponseHandler } from '../../utils/responseHandler';
import { amlError } from '../../types/amlError';

export const apiId = 'api.subskill.update';

//Function for the sub-skill update
const updateSubSkill = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');
  const sub_skill_id = _.get(req, 'params.sub_skill_id');
  const dataBody = _.get(req, 'body.request');

  // Validate request schema
  const isRequestValid = schemaValidation(requestBody, subSkillUpdateJson);
  if (!isRequestValid.isValid) {
    const code = 'SUBSKILL_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  // Validate sub-skill existence
  const subSkill = await getSubSkill(sub_skill_id);
  if (_.isEmpty(subSkill)) {
    const code = 'SUBSKILL_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: 'Sub-skill does not exist' });
    throw amlError(code, 'Sub-skill does not exist', 'NOT_FOUND', 404);
  }

  const mergedData = _.merge({}, subSkill, dataBody);
  // Update the sub-skill
  await updateSubSkillData(sub_skill_id, mergedData);

  ResponseHandler.successResponse(req, res, {
    status: httpStatus.OK,
    data: { message: 'Sub-skill successfully updated' },
  });
};

export default updateSubSkill;
