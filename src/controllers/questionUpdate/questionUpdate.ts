import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { getQuestionById, updateQuestionData } from '../../services/question';
import { schemaValidation } from '../../services/validationService';
import logger from '../../utils/logger';
import questionUpdateSchema from './questionUpdateValidationSchema.json';
import { amlError } from '../../types/amlError';
import { ResponseHandler } from '../../utils/responseHandler';
import { checkTenantNameExists } from '../../services/tenant';
import { checkRepositoryNameExists } from '../../services/repository';
import { checkBoardNamesExists } from '../../services/board';
import { checkClassNameExists } from '../../services/class';
import { checkSkillExists } from '../../services/skill';
import { SkillType } from '../../enums/skillType';
import { checkSubSkillsExist } from '../../services/subSkill';

export const apiId = 'api.question.update';

const updateQuestionById = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const question_id = _.get(req, 'params.question_id');
  const dataBody = _.get(req, 'body.request');
  const resmsgid = _.get(res, 'resmsgid');

  // Validating the update schema
  const isRequestValid: Record<string, any> = schemaValidation(requestBody, questionUpdateSchema);
  if (!isRequestValid.isValid) {
    const code = 'QUESTION_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  // Validate question existence
  const question = await getQuestionById(question_id);

  if (_.isEmpty(question)) {
    const code = 'QUESTION_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: 'Question does not exist' });
    throw amlError(code, 'Question does not exists', 'NOT_FOUND', 404);
  }

  // Initialize an updated body
  const updatedDataBody: any = {};

  // Extract and check tenant
  if (dataBody.tenant) {
    const tenantName = dataBody.tenant.name;
    const { exists: tenantExists, tenant } = await checkTenantNameExists(tenantName);
    if (!tenantExists || !tenant) {
      const code = 'TENANT_NOT_EXISTS';
      logger.error({ code, apiId, msgid, resmsgid, message: `Tenant not exists` });
      throw amlError(code, 'Tenant not exists', 'NOT_FOUND', 404);
    }
    updatedDataBody.tenant = { id: tenant.id, name: tenant.name }; // Create tenant object
  }

  // Check repository
  if (dataBody.repository) {
    const repositoryName = dataBody.repository.name;
    const repositoryExists = await checkRepositoryNameExists(repositoryName);
    if (!repositoryExists.exists) {
      const code = 'REPOSITORY_NOT_EXISTS';
      logger.error({ code, apiId, msgid, resmsgid, message: `Repository not exists` });
      throw amlError(code, 'Repository not exists', 'NOT_FOUND', 404);
    }
    updatedDataBody.repository = { id: repositoryExists.repository.id, name: repositoryExists.repository.name }; // Create repository object
  }

  // Check board
  if (dataBody.taxonomy && dataBody.taxonomy.board) {
    const boardName = dataBody.taxonomy.board.name;
    const boardExists = await checkBoardNamesExists(boardName);
    if (!boardExists.exists) {
      const code = 'BOARD_NOT_EXISTS';
      logger.error({ code, apiId, msgid, resmsgid, message: `Board not exists` });
      throw amlError(code, 'Board not exists', 'NOT_FOUND', 404);
    }
    updatedDataBody.taxonomy = { ...updatedDataBody.taxonomy, board: { id: boardExists.board.id, name: boardExists.board.name } }; // Create board object
  }

  // Check class
  if (dataBody.taxonomy && dataBody.taxonomy.class) {
    const className = dataBody.taxonomy.class.name;
    const classExists = await checkClassNameExists(className);
    if (!classExists.exists) {
      const code = 'CLASS_NOT_EXISTS';
      logger.error({ code, apiId, msgid, resmsgid, message: `Class not exists` });
      throw amlError(code, 'Class not exists', 'NOT_FOUND', 404);
    }
    updatedDataBody.taxonomy = { ...updatedDataBody.taxonomy, class: { id: classExists.class.id, name: classExists.class.name } }; // Create class object
  }

  // Check l1_skill
  if (dataBody.taxonomy && dataBody.taxonomy.l1_skill) {
    const l1SkillExists = await checkSkillExists(dataBody.taxonomy.l1_skill.name, SkillType.L1_SKILL);
    if (!l1SkillExists.exists) {
      const code = 'L1_SKILL_NOT_EXISTS';
      logger.error({ code, apiId, msgid, resmsgid, message: `L1 Skill not exists` });
      throw amlError(code, 'L1 Skill not exists', 'NOT_FOUND', 404);
    }
    updatedDataBody.taxonomy = { ...updatedDataBody.taxonomy, l1_skill: { id: l1SkillExists.skill.id, name: l1SkillExists.skill.name } }; // Create l1_skill object
  }

  // Check l2_skill
  if (dataBody.taxonomy && dataBody.taxonomy.l2_skill) {
    const l2SkillObjects = [];
    for (const l2Skill of dataBody.taxonomy.l2_skill) {
      const l2SkillExists = await checkSkillExists(l2Skill.name, SkillType.L2_SKILL);
      if (!l2SkillExists.exists) {
        const code = 'L2_SKILL_NOT_EXISTS';
        logger.error({ code, apiId, msgid, resmsgid, message: `L2 Skill not exists` });
        throw amlError(code, 'L2 Skill not exists', 'NOT_FOUND', 404);
      }
      l2SkillObjects.push({ id: l2SkillExists.skill.id, name: l2SkillExists.skill.name });
    }
    updatedDataBody.taxonomy = { ...updatedDataBody.taxonomy, l2_skill: l2SkillObjects }; // Create l2_skill objects
  }

  // Check l3_skill
  if (dataBody.taxonomy && dataBody.taxonomy.l3_skill) {
    const l3SkillObjects = [];
    for (const l3Skill of dataBody.taxonomy.l3_skill) {
      const l3SkillExists = await checkSkillExists(l3Skill.name, SkillType.L3_SKILL);
      if (!l3SkillExists.exists) {
        const code = 'L3_SKILL_NOT_EXISTS';
        logger.error({ code, apiId, msgid, resmsgid, message: `L3 Skill not exists` });
        throw amlError(code, 'L3 Skill not exists', 'NOT_FOUND', 404);
      }
      l3SkillObjects.push({ id: l3SkillExists.skill.id, name: l3SkillExists.skill.name });
    }
    updatedDataBody.taxonomy = { ...updatedDataBody.taxonomy, l3_skill: l3SkillObjects }; // Create l3_skill objects
  }

  // Validate sub_skills
  if (dataBody.sub_skills) {
    const subSkillsExistence = await checkSubSkillsExist(dataBody.sub_skills);
    if (!subSkillsExistence.exists) {
      const code = 'SUB_SKILL_NOT_EXISTS';
      logger.error({ code, apiId, msgid, resmsgid, message: `Missing sub-skills` });
      throw amlError(code, 'Sub Skill not exists', 'NOT_FOUND', 404);
    }
    updatedDataBody.sub_skills = subSkillsExistence.foundSkills; // Add found sub-skills
  }

  const mergedData = _.merge({}, question, dataBody, updatedDataBody);

  // Update Question
  await updateQuestionData(question_id, mergedData);
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Question Successfully Updated' } });
};

export default updateQuestionById;
