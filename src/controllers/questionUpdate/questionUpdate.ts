import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { questionService } from '../../services/questionService';
import { schemaValidation } from '../../services/validationService';
import logger from '../../utils/logger';
import questionUpdateSchema from './questionUpdateValidationSchema.json';
import { amlError } from '../../types/amlError';
import { ResponseHandler } from '../../utils/responseHandler';
import { getRepositoryById } from '../../services/repository';
import { boardService } from '../../services/boardService';
import { getClassById } from '../../services/class';
import { getSkillById } from '../../services/skill';
import { SkillType } from '../../enums/skillType';
import { getSubSkill } from '../../services/subSkill';
import { getQuestionBody } from '../questionCreate/questionCreate.helper';
import { User } from '../../models/users';
import { UserTransformer } from '../../transformers/entity/user.transformer';
import { getUserByIdentifier } from '../../services/user';

const updateQuestionById = async (req: Request, res: Response) => {
  const apiId = _.get(req, 'id');
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const question_id = _.get(req, 'params.question_id');
  const dataBody = _.get(req, 'body.request');
  const resmsgid = _.get(res, 'resmsgid');
  const loggedInUser: User | undefined = (req as any).user;

  // Validating the update schema
  const isRequestValid: Record<string, any> = schemaValidation(requestBody, questionUpdateSchema);
  if (!isRequestValid.isValid) {
    const code = 'QUESTION_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  // Validate question existence
  const question = await questionService.getQuestionById(question_id);

  if (_.isEmpty(question)) {
    const code = 'QUESTION_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: 'Question does not exist' });
    throw amlError(code, 'Question does not exists', 'NOT_FOUND', 404);
  }

  // Initialize an updated body
  const updatedDataBody: any = {};

  // Check repository
  if (dataBody.repository_id) {
    const repositoryId = dataBody.repository_id;
    const repository = await getRepositoryById(repositoryId);
    if (!repository) {
      const code = 'REPOSITORY_NOT_EXISTS';
      logger.error({ code, apiId, msgid, resmsgid, message: `Repository not exists` });
      throw amlError(code, 'Repository not exists', 'NOT_FOUND', 404);
    }
    updatedDataBody.repository = {
      identifier: repository.identifier,
      name: repository.name,
    }; // Create repository object
  }

  // Check board
  if (dataBody.board_id) {
    const boardId = dataBody.board_id;
    const board = await boardService.getBoardByIdentifier(boardId);
    if (!board) {
      const code = 'BOARD_NOT_EXISTS';
      logger.error({ code, apiId, msgid, resmsgid, message: `Board not exists` });
      throw amlError(code, 'Board not exists', 'NOT_FOUND', 404);
    }

    const boardObject = {
      identifier: board.identifier,
      name: board.name,
    };
    updatedDataBody.taxonomy = { ...updatedDataBody.taxonomy, board: boardObject }; // Create board object
  }

  // Check class
  if (dataBody.class_id) {
    const classId = dataBody.class_id;
    const classEntity = await getClassById(classId);
    if (!classEntity) {
      const code = 'CLASS_NOT_EXISTS';
      logger.error({ code, apiId, msgid, resmsgid, message: `Class not exists` });
      throw amlError(code, 'Class not exists', 'NOT_FOUND', 404);
    }

    const classObject = {
      identifier: classEntity.identifier,
      name: classEntity.name,
    };
    updatedDataBody.taxonomy = { ...updatedDataBody.taxonomy, class: classObject }; // Create class object
  }

  // Check l1_skill
  if (dataBody.l1_skill_id) {
    const l1Skill = await getSkillById(dataBody.l1_skill_id);
    if (!l1Skill || l1Skill.type !== SkillType.L1_SKILL) {
      const code = 'L1_SKILL_NOT_EXISTS';
      logger.error({ code, message: `L1 Skill not exists` });
      throw amlError(code, 'L1 Skill not exists', 'NOT_FOUND', 404);
    }

    const l1SkillObject = {
      identifier: l1Skill.identifier,
      name: l1Skill.name,
    };
    updatedDataBody.taxonomy = { ...updatedDataBody.taxonomy, l1_skill: l1SkillObject }; // Create l1_skill object
  }

  // Check l2_skill
  if (dataBody.l2_skill_ids) {
    const l2SkillObjects = [];
    for (const l2SkillId of dataBody.l2_skill_ids || []) {
      const l2Skill = await getSkillById(l2SkillId);
      if (!l2Skill || l2Skill.type !== SkillType.L2_SKILL) {
        const code = 'L2_SKILL_NOT_EXISTS';
        logger.error({ code, message: `L2 Skill not exists` });
        throw amlError(code, 'L2 Skill not exists', 'NOT_FOUND', 404);
      }
      l2SkillObjects.push({
        identifier: l2Skill.identifier,
        name: l2Skill.name,
      });
    }
    updatedDataBody.taxonomy = { ...updatedDataBody.taxonomy, l2_skill: l2SkillObjects }; // Create l2_skill objects
  }

  // Check l3_skill
  if (dataBody.l3_skill_ids) {
    const l3SkillObjects = [];
    for (const l3SkillId of dataBody.l3_skill_ids || []) {
      const l3Skill = await getSkillById(l3SkillId);
      if (!l3Skill || l3Skill.type !== SkillType.L3_SKILL) {
        const code = 'L3_SKILL_NOT_EXISTS';
        logger.error({ code, message: `L3 Skill not exists` });
        throw amlError(code, 'L3 Skill not exists', 'NOT_FOUND', 404);
      }
      l3SkillObjects.push({
        identifier: l3Skill.identifier,
        name: l3Skill.name,
      });
    }
    updatedDataBody.taxonomy = { ...updatedDataBody.taxonomy, l3_skill: l3SkillObjects }; // Create l3_skill objects
  }

  // Validate sub_skills
  if (dataBody.sub_skills_ids) {
    const subSkillObjects = [];
    for (const subSkillId of dataBody.sub_skill_ids || []) {
      const subSkill = await getSubSkill(subSkillId);
      if (!subSkill) {
        const code = 'SUB_SKILL_NOT_EXISTS';
        logger.error({ code, message: `Missing sub-skills` });
        throw amlError(code, 'sub Skill not exists', 'NOT_FOUND', 404);
      }
      subSkillObjects.push({
        identifier: subSkill.identifier,
        name: subSkill.name,
      });
    }
    updatedDataBody.sub_skills = subSkillObjects; // Add found sub-skills
  }

  updatedDataBody.question_body = getQuestionBody(_.cloneDeep(dataBody));
  updatedDataBody.updated_by = loggedInUser?.identifier ?? 'manual';

  // Update Question
  const [, affectedRows] = await questionService.updateQuestionData(question_id, { ...dataBody, ...updatedDataBody });

  const createdByUser = await getUserByIdentifier(affectedRows?.[0]?.created_by);

  const users = new UserTransformer().transformList(_.uniqBy([createdByUser, loggedInUser], 'identifier').filter((v) => !!v));

  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Question Successfully Updated', question: affectedRows?.[0] ?? {}, users } });
};

export default updateQuestionById;
