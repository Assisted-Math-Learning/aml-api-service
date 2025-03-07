import { Request, Response } from 'express';
import _ from 'lodash';
import { amlError } from '../../types/amlError';
import { getCSVEntries } from './helper';
import { AppDataSource } from '../../config';
import { ResponseHandler } from '../../utils/responseHandler';
import httpStatus from 'http-status';
import { subSkillMasterService } from '../../services/subSkillMasterService';
import { subSkillValuesService } from '../../services/subSkillValuesService';
import * as uuid from 'uuid';

const initializeSubSkillValuesTable = async (req: Request, res: Response) => {
  const csvFile = _.get(req, ['files', 'document'], {});

  if (!csvFile) {
    const code = 'UPLOAD_INVALID_INPUT';
    throw amlError(code, 'document missing', 'BAD_REQUEST', 400);
  }
  const rows = getCSVEntries(csvFile);
  const transaction = await AppDataSource.transaction();

  const subSkillMap = {};

  try {
    for (const row of rows.slice(1)) {
      const [topic, topic__subSkill, subSkillValue, sequence] = row;
      const [, subSkill] = topic__subSkill.split('__');
      if (Number.isNaN(+sequence)) {
        const code = 'INVALID_SEQUENCE';
        throw amlError(code, `Invalid sequence value: ${sequence}`, 'BAD_REQUEST', 400);
      }

      let subSkillIdentifier = _.get(subSkillMap, topic__subSkill);
      if (!subSkillIdentifier) {
        const subSkillExists = await subSkillMasterService.findByTopicAndName(topic.trim(), subSkill.trim());
        if (!subSkillExists) {
          const code = 'INVALID_SUB_SKILL';
          throw amlError(code, `Invalid sub_skill ${topic__subSkill}`, 'BAD_REQUEST', 400);
        } else {
          subSkillIdentifier = subSkillExists.identifier;
        }
        _.set(subSkillMap, topic__subSkill, subSkillIdentifier);
      }
      await subSkillValuesService.create(
        {
          identifier: uuid.v4(),
          sub_skill_id: subSkillIdentifier,
          skill_value_name: subSkillValue === 'na' ? null : subSkillValue,
          sequence: +sequence,
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

export default initializeSubSkillValuesTable;
