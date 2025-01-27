import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import questionSearch from './contentSearchValidationSchema.json';
import { schemaValidation } from '../../services/validationService';
import { amlError } from '../../types/amlError';
import { ResponseHandler } from '../../utils/responseHandler';
import { getContentList } from '../../services/content';
import { getFileUrlByFolderAndFileName } from '../../services/awsService';
import { getUsersByIdentifiers } from '../../services/user';
import { UserTransformer } from '../../transformers/entity/user.transformer';
import { getRepositoryById } from '../../services/repository';
import { boardService } from '../../services/boardService';
import { classService } from '../../services/classService';
import { getSkillByIdAndType } from '../../services/skill';
import { SkillType } from '../../enums/skillType';

export const searchContents = async (req: Request, res: Response) => {
  const apiId = _.get(req, 'id');
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');

  const isRequestValid: Record<string, any> = schemaValidation(requestBody, questionSearch);
  if (!isRequestValid.isValid) {
    const code = 'CONTENT_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  // Replace questionSetData with content
  const { contents, meta } = await getContentList(requestBody.request);

  const updatedContents = contents.reduce((agg: any[], curr) => {
    curr.media = (curr.media || [])
      ?.filter((v) => !!v)
      ?.map((media) => ({
        ...media,
        url: getFileUrlByFolderAndFileName(media?.src, media?.fileName),
      }));
    agg = [...agg, curr];
    return agg;
  }, []);

  const userIds = contents
    .reduce((agg: string[], curr) => {
      agg = [...agg, curr.created_by, curr?.updated_by as string];
      return agg;
    }, [])
    .filter((v) => !!v);

  const users = await getUsersByIdentifiers(userIds);

  const transformedUsers = new UserTransformer().transformList(users);

  const repositories = {};
  const boards = {};
  const classes = {};
  const l1_skills = {};
  const l2_skills = {};
  const l3_skills = {};

  for (const content of updatedContents) {
    const { repository, taxonomy } = content;
    const { board, class: questionClass, l1_skill, l2_skill, l3_skill } = taxonomy;
    _.set(repositories, repository.identifier, repository);
    _.set(boards, board.identifier, board);
    _.set(classes, questionClass.identifier, questionClass);
    _.set(l1_skills, l1_skill.identifier, l1_skill);

    for (const skill of l2_skill) {
      _.set(l2_skills, skill.identifier, skill);
    }

    for (const skill of l3_skill) {
      _.set(l3_skills, skill.identifier, skill);
    }
  }

  if (!updatedContents.length) {
    const { filters } = requestBody.request;
    if (filters) {
      if (filters.repository_id) {
        const repository = await getRepositoryById(filters.repository_id);
        if (repository) {
          _.set(repositories, repository.identifier, repository);
        }
      }
      if (filters.board_id) {
        const board = await boardService.getBoardByIdentifier(filters.board_id);
        if (board) {
          _.set(boards, board.identifier, board);
        }
      }
      if (filters.class_id) {
        const classObj = await classService.getClassById(filters.class_id);
        if (classObj) {
          _.set(classes, classObj.identifier, classObj);
        }
      }
      if (filters.l1_skill_id) {
        const skill = await getSkillByIdAndType(filters.l1_skill_id, SkillType.L1_SKILL);
        if (skill) {
          _.set(l1_skills, skill.identifier, skill);
        }
      }
      if (filters.l2_skill_id) {
        const skill = await getSkillByIdAndType(filters.l2_skill_id, SkillType.L2_SKILL);
        if (skill) {
          _.set(l2_skills, skill.identifier, skill);
        }
      }
      if (filters.l3_skill_id) {
        const skill = await getSkillByIdAndType(filters.l3_skill_id, SkillType.L3_SKILL);
        if (skill) {
          _.set(l3_skills, skill.identifier, skill);
        }
      }
    }
  }

  logger.info({ apiId, requestBody, message: `Content is listed successfully` });

  // Update the response to return content instead of questionSetData
  ResponseHandler.successResponse(req, res, {
    status: httpStatus.OK,
    data: {
      contents: updatedContents,
      meta,
      users: transformedUsers,
      repositories: Object.values(repositories),
      boards: Object.values(boards),
      classes: Object.values(classes),
      l1_skills: Object.values(l1_skills),
      l2_skills: Object.values(l2_skills),
      l3_skills: Object.values(l3_skills),
    },
  });
};
