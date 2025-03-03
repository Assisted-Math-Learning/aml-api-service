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
      const [subSkill, subSkillValue, sequence] = row;
      if (Number.isNaN(+sequence)) {
        const code = 'INVALID_SEQUENCE';
        throw amlError(code, `Invalid sequence value: ${sequence}`, 'BAD_REQUEST', 400);
      }

      let subSkillIdentifier = _.get(subSkillMap, subSkill);
      if (!subSkillIdentifier) {
        const subSkillExists = await subSkillMasterService.findByName(subSkill);
        if (!subSkillExists) {
          const code = 'INVALID_SUB_SKILL';
          throw amlError(code, `Invalid sub_skill ${subSkill}`, 'BAD_REQUEST', 400);
        } else {
          subSkillIdentifier = subSkillExists.identifier;
        }
        _.set(subSkillMap, subSkill, subSkillIdentifier);
      }
      await subSkillValuesService.create(
        {
          identifier: uuid.v4(),
          sub_skill_id: subSkillIdentifier,
          skill_value_name: subSkillValue,
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
