import { Request, Response } from 'express';
import _ from 'lodash';
import { amlError } from '../../types/amlError';
import { getCSVEntries } from './helper';
import { AppDataSource } from '../../config';
import { ResponseHandler } from '../../utils/responseHandler';
import httpStatus from 'http-status';
import { QuestionOperation } from '../../enums/questionOperation';
import { subSkillMasterService } from '../../services/subSkillMasterService';
import * as uuid from 'uuid';

const initializeSubSkillMasterTable = async (req: Request, res: Response) => {
  const csvFile = _.get(req, ['files', 'document'], {});

  if (!csvFile) {
    const code = 'UPLOAD_INVALID_INPUT';
    throw amlError(code, 'document missing', 'BAD_REQUEST', 400);
  }
  const rows = getCSVEntries(csvFile);
  const transaction = await AppDataSource.transaction();

  try {
    for (const row of rows.slice(1)) {
      const [topic, subSkill, skillType, sequence] = row;
      if (!Object.values(QuestionOperation).includes(topic as QuestionOperation)) {
        const code = 'INVALID_TOPIC';
        throw amlError(code, `Invalid topic ${topic}`, 'BAD_REQUEST', 400);
      }

      if (Number.isNaN(+sequence)) {
        const code = 'INVALID_SEQUENCE';
        throw amlError(code, `Invalid sequence value: ${sequence}`, 'BAD_REQUEST', 400);
      }

      await subSkillMasterService.create(
        {
          identifier: uuid.v4(),
          topic,
          skill_name: subSkill,
          skill_type: skillType,
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

export default initializeSubSkillMasterTable;
