import { Request, Response } from 'express';
import _ from 'lodash';
import { amlError } from '../../types/amlError';
import { getCSVEntries } from './helper';
import { AppDataSource } from '../../config';
import { ResponseHandler } from '../../utils/responseHandler';
import httpStatus from 'http-status';
import { QuestionOperation } from '../../enums/questionOperation';
import { subTopicService } from '../../services/subTopicService';
import { subSkillMasterService } from '../../services/subSkillMasterService';
import { subSkillValuesService } from '../../services/subSkillValuesService';
import { primarySkillCombinationService } from '../../services/primarySkillCombinationService';
import * as uuid from 'uuid';

const initializePrimarySkillCombinationsTable = async (req: Request, res: Response) => {
  const csvFile = _.get(req, ['files', 'document'], {});

  if (!csvFile) {
    const code = 'UPLOAD_INVALID_INPUT';
    throw amlError(code, 'document missing', 'BAD_REQUEST', 400);
  }
  const rows = getCSVEntries(csvFile);
  const transaction = await AppDataSource.transaction();

  const subTopicMap = {};
  const subSkillMap = {};
  const subSkillValueMap = {};

  try {
    for (const row of rows.slice(1)) {
      const [topic, subTopic, priorityLevel, level, subSkillValues] = row;
      if (!Object.values(QuestionOperation).includes(topic as QuestionOperation)) {
        const code = 'INVALID_TOPIC';
        throw amlError(code, `Invalid topic ${topic}`, 'BAD_REQUEST', 400);
      }

      let subTopicIdentifier = _.get(subTopicMap, subTopic);
      if (!subTopicIdentifier) {
        const subTopicExists = await subTopicService.findByName(subTopic);
        if (!subTopicExists) {
          const code = 'INVALID_SUB_TOPIC';
          throw amlError(code, `Invalid sub_topic ${subTopic}`, 'BAD_REQUEST', 400);
        } else {
          subTopicIdentifier = subTopicExists.identifier;
        }
        _.set(subTopicMap, subTopic, subTopicIdentifier);
      }

      if (Number.isNaN(+priorityLevel)) {
        const code = 'INVALID_PRIORITY_LEVEL';
        throw amlError(code, `Invalid priority_level value: ${priorityLevel}`, 'BAD_REQUEST', 400);
      }

      let levels: any = level;
      if (level.includes('(') && level.includes(')')) {
        levels = level.split(')')?.[0].split('(')?.[1];
      }
      levels = levels.split('#');
      const allLevelsAreNumber = levels.every((level: any) => !Number.isNaN(+level));
      if (!allLevelsAreNumber) {
        const code = 'INVALID_LEVEL';
        throw amlError(code, `Invalid level value: ${level}`, 'BAD_REQUEST', 400);
      }

      const subSkillValueIds: string[] = [];
      for (const subSkillValue of subSkillValues.replace('{', '').replace('}', '').split(';')) {
        const [, subSkillAndValue] = subSkillValue.split('__');
        const [subSkill, subSkillVal] = subSkillAndValue.split(':').map((s) => s.trim());
        // validating sub_skill
        let subSkillIdentifier = _.get(subSkillMap, subSkill);
        if (!subSkillIdentifier) {
          const subSkillExists = await subSkillMasterService.findByTopicAndName(topic, subSkill);
          if (!subSkillExists) {
            const code = 'INVALID_SUB_SKILL';
            throw amlError(code, `Invalid sub_skill ${subSkill}`, 'BAD_REQUEST', 400);
          } else {
            subSkillIdentifier = subSkillExists.identifier;
          }
          _.set(subSkillMap, subSkill, subSkillIdentifier);
        }
        // validating sub_skill_value
        const subSkillValueKey = `${subSkillIdentifier}_${subSkillVal}`;
        let subSkillValueIdentifier = _.get(subSkillValueMap, subSkillValueKey);
        if (!subSkillValueIdentifier) {
          const subSkillValueExists = await subSkillValuesService.findBySkillIdAndName(subSkillIdentifier, subSkillVal === 'na' ? null : subSkillVal);
          if (!subSkillValueExists) {
            const code = 'INVALID_SUB_SKILL_VALUE';
            throw amlError(code, `Invalid sub_skill_value ${subSkillValue}`, 'BAD_REQUEST', 400);
          } else {
            subSkillValueIdentifier = subSkillValueExists.identifier;
          }
          _.set(subSkillValueMap, subSkillValueKey, subSkillValueIdentifier);
        }
        subSkillValueIds.push(subSkillValueIdentifier);
      }

      await primarySkillCombinationService.create(
        {
          identifier: uuid.v4(),
          topic,
          sub_topic_id: subTopicIdentifier,
          priority_level: +priorityLevel,
          level: levels.map(Number),
          sub_skill_value_ids: subSkillValueIds,
          created_by: 'migration-api',
        },
        transaction,
      );
    }
    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    throw e;
  }

  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { success: true } });
};

export default initializePrimarySkillCombinationsTable;
