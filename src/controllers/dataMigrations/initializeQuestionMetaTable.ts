import { Request, Response } from 'express';
import { ResponseHandler } from '../../utils/responseHandler';
import httpStatus from 'http-status';
import _ from 'lodash';
import { amlError } from '../../types/amlError';
import { getCSVEntries } from './helper';
import { AppDataSource } from '../../config';
import { subSkillMasterService } from '../../services/subSkillMasterService';
import { subSkillValuesService } from '../../services/subSkillValuesService';
import { questionMetaService } from '../../services/questionMetaService';

const initializeQuestionMetaTable = async (req: Request, res: Response) => {
  const csvFile = _.get(req, ['files', 'document'], {});

  if (!csvFile) {
    const code = 'UPLOAD_INVALID_INPUT';
    throw amlError(code, 'document missing', 'BAD_REQUEST', 400);
  }
  const rows = getCSVEntries(csvFile);
  const transaction = await AppDataSource.transaction();

  const subSkillMap = {};
  const subSkillValueMap = {};

  try {
    for (const row of rows.slice(1)) {
      const [questionGroupId, subSkillValues, complexityScore, questionMeta] = row;

      if (Number.isNaN(+complexityScore)) {
        const code = 'INVALID_COMPLEXITY_SCORE';
        throw amlError(code, `Invalid complexity_score value: ${complexityScore}`, 'BAD_REQUEST', 400);
      }

      const subSkillValueIds: string[] = [];
      for (const subSkillValue of subSkillValues.replace('{', '').replace('}', '').split(';')) {
        const [topic, subSkillAndValue] = subSkillValue.split('__');
        const [subSkill, subSkillVal] = subSkillAndValue.split(':').map((s) => s.trim());
        // validating sub_skill
        let subSkillIdentifier = _.get(subSkillMap, subSkill);
        if (!subSkillIdentifier) {
          const subSkillExists = await subSkillMasterService.findByTopicAndName(topic.trim(), subSkill.trim());
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

      const questionMetaData = questionMeta.replace('{', '').replace('}', '').trim().split(';');

      const questionMetaObj = {};

      for (const data of questionMetaData) {
        const [key, value] = data.split(':');
        _.set(questionMetaObj, key.trim(), +value);
      }

      await questionMetaService.create(
        { question_group_id: questionGroupId, complexity_score: +complexityScore, sub_skill_value_ids: subSkillValueIds, meta: questionMetaObj, created_by: 'migration-api' },
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

export default initializeQuestionMetaTable;
