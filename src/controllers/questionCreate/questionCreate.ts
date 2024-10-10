import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import questionSchema from './questionCreateValidationSchema.json';
import httpStatus from 'http-status';
import { createQuestionData } from '../../services/question';
import { schemaValidation } from '../../services/validationService';
import * as uuid from 'uuid';
import { amlError } from '../../types/amlError';
import { ResponseHandler } from '../../utils/responseHandler';
import { checkTenantNameExists } from '../../services/tenant';
import { checkRepositoryNameExists } from '../../services/repository';
import { checkBoardNamesExists } from '../../services/board';
import { checkClassNameExists } from '../../services/class';
import { checkSkillExists } from '../../services/skill';
import { SkillType } from '../../enums/skillType';
import { checkSubSkillsExist } from '../../services/subSkill';

export const apiId = 'api.question.create';

const createQuestion = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const dataBody = _.get(req, 'body.request');
  const resmsgid = _.get(res, 'resmsgid');

  // Validating the schema
  const isRequestValid: Record<string, any> = schemaValidation(requestBody, questionSchema);
  if (!isRequestValid.isValid) {
    const code = 'QUESTION_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  // Extracting tenant names and checking if it exists
  const tenantName = dataBody.tenant.name;
  const { exists: tenantExists, tenant } = await checkTenantNameExists(tenantName);
  if (!tenantExists || !tenant) {
    const code = 'TENANT_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: `Tenant not exists` });
    throw amlError(code, 'Tenant not exists', 'NOT_FOUND', 404);
  }

  // Create the tenant object
  const tenantObject = {
    id: tenant.id,
    name: tenant.name,
  };

  // Check repository
  const repositoryName = dataBody.repository.name;
  const repositoryExists = await checkRepositoryNameExists(repositoryName);
  if (!repositoryExists.exists) {
    const code = 'REPOSITORY_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: `Repository not exists` });
    throw amlError(code, 'Repository not exists', 'NOT_FOUND', 404);
  }

  // Create the repository object
  const repositoryObject = {
    id: repositoryExists.repository.id,
    name: repositoryExists.repository.name,
  };

  // Check board
  const boardName = dataBody.taxonomy.board.name;
  const boardExists = await checkBoardNamesExists(boardName);
  if (!boardExists.exists) {
    const code = 'BOARD_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: `Board not exists` });
    throw amlError(code, 'Board not exists', 'NOT_FOUND', 404);
  }

  const boardObject = {
    id: boardExists.board.id,
    name: boardExists.board.name,
  };

  // Check class
  const className = dataBody.taxonomy.class.name;
  const classExists = await checkClassNameExists(className);
  if (!classExists.exists) {
    const code = 'CLASS_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: `Class not exists` });
    throw amlError(code, 'Class not exists', 'NOT_FOUND', 404);
  }

  const classObject = {
    id: classExists.class.id,
    name: classExists.class.name,
  };

  // Check l1_skill and add ID along with the name
  const l1SkillExists = await checkSkillExists(dataBody.taxonomy.l1_skill.name, SkillType.L1_SKILL);
  if (!l1SkillExists.exists) {
    const code = 'L1_SKILL_NOT_EXISTS';
    logger.error({ code, message: `L1 Skill not exists` });
    throw amlError(code, 'L1 Skill not exists', 'NOT_FOUND', 404);
  }

  const l1SkillObject = {
    id: l1SkillExists.skill.id,
    name: l1SkillExists.skill.name,
  };

  // Check l2_skill (assuming it's an array of skills) and add IDs along with names
  const l2SkillObjects = [];
  for (const l2Skill of dataBody.taxonomy.l2_skill) {
    const l2SkillExists = await checkSkillExists(l2Skill.name, SkillType.L2_SKILL);
    if (!l2SkillExists.exists) {
      const code = 'L2_SKILL_NOT_EXISTS';
      logger.error({ code, message: `L2 Skill not exists` });
      throw amlError(code, 'L2 Skill not exists', 'NOT_FOUND', 404);
    }
    l2SkillObjects.push({
      id: l2SkillExists.skill.id,
      name: l2SkillExists.skill.name,
    });
  }

  // Check l3_skill (assuming it's an array of skills) and add IDs along with names
  const l3SkillObjects = [];
  for (const l3Skill of dataBody.taxonomy.l3_skill) {
    const l3SkillExists = await checkSkillExists(l3Skill.name, SkillType.L3_SKILL);
    if (!l3SkillExists.exists) {
      const code = 'L3_SKILL_NOT_EXISTS';
      logger.error({ code, message: `L3 Skill not exists` });
      throw amlError(code, 'L3 Skill not exists', 'NOT_FOUND', 404);
    }
    l3SkillObjects.push({
      id: l3SkillExists.skill.id,
      name: l3SkillExists.skill.name,
    });
  }

  let subSkillObjects;
  if (dataBody.sub_skills) {
    const subSkillsExistence = await checkSubSkillsExist(dataBody.sub_skills);
    if (!subSkillsExistence.exists) {
      const code = 'SUB_SKILL_NOT_EXISTS';
      logger.error({ code, message: `Missing sub-skills` });
      throw amlError(code, 'sub Skill not exists', 'NOT_FOUND', 404);
    }
    subSkillObjects = subSkillsExistence.foundSkills;
  }

  // Construct the questionData object with all updated objects including sub-skills with IDs
  const questionData = _.assign(dataBody, {
    is_active: true,
    status: 'draft',
    identifier: uuid.v4(),
    created_by: 'manual',
    tenant: tenantObject,
    repository: repositoryObject,
    taxonomy: {
      board: boardObject,
      class: classObject,
      l1_skill: l1SkillObject,
      l2_skill: l2SkillObjects,
      l3_skill: l3SkillObjects,
    },
    sub_skills: subSkillObjects,
  });

  // Create the question
  const insertedQuestionData = await createQuestionData(questionData);

  logger.info({ apiId, requestBody, message: `Question Created Successfully with identifier:${insertedQuestionData.identifier}` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Question Successfully Created', identifier: insertedQuestionData.identifier } });
};

export default createQuestion;
