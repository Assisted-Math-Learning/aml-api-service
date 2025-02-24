import { Request, Response } from 'express';
import { ResponseHandler } from '../../utils/responseHandler';
import httpStatus from 'http-status';
import _ from 'lodash';
import { amlError } from '../../types/amlError';
import { getCSVEntries } from './helper';
import { AppDataSource } from '../../config';
import { Learner } from '../../models/learner';
import bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { learnerService } from '../../services/learnerService';

const createTelanganaLearners = async (req: Request, res: Response) => {
  const csvFile = _.get(req, ['files', 'document'], {});
  if (!csvFile) {
    const code = 'UPLOAD_INVALID_INPUT';
    throw amlError(code, 'document missing', 'BAD_REQUEST', 400);
  }

  const rows = getCSVEntries(csvFile);
  const transaction = await AppDataSource.transaction();

  const classMapping: any = {
    2: '9b50a7e7-fdec-4fd7-bf63-84b3e62e4247',
    3: '9b50a7e7-fdec-4fd7-bf63-84b3e62e4246',
    4: '9b50a7e7-fdec-4fd7-bf63-84b3e62e4245',
    5: '9b50a7e7-fdec-4fd7-bf63-84b3e62e4212',
    6: '9b50a7e7-fdec-4fd7-bf63-84b3e62e4243',
  };

  const boardId = '9b50a7e7-fdec-4fd7-bf63-84b3e62e334g';
  const tenantId = '9811db1e-e7e8-46d1-8a7b-86e32d45999d';

  const usernames = rows.slice(1).map((row) => row[0]);

  const existingLearners = await learnerService.getLearnersByUserNamesAndTenantId(usernames, tenantId);

  const usernamesOfExistingLearners = existingLearners.map((l) => l.username);
  try {
    for (const row of rows.slice(1)) {
      const [username, password, grade] = row;
      if (usernamesOfExistingLearners.includes(username)) {
        continue;
      }
      const classId = _.get(classMapping, grade);
      if (!classId) {
        throw new Error(`Invalid grade: ${grade}`);
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      await Learner.create(
        {
          identifier: uuid.v4(),
          username,
          password: encryptedPassword,
          board_id: boardId,
          class_id: classId,
          tenant_id: tenantId,
          created_by: 'createTelanganaLearners-api',
          taxonomy: {},
        },
        { transaction },
      );
    }
    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { success: true } });
};

export default createTelanganaLearners;
