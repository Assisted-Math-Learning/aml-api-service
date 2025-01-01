import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { boardService } from '../../services/boardService';
import { schemaValidation } from '../../services/validationService';
import logger from '../../utils/logger';
import boardUpdateJson from './updateBoardValidationSchema.json';
import { ResponseHandler } from '../../utils/responseHandler';
import { amlError } from '../../types/amlError';
import { getClassById } from '../../services/class';
import { checkSkillsExistByIds } from '../../services/skill';

export const apiId = 'api.board.update';

// Function for board Update
const updateBoard = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');
  const board_id = _.get(req, 'params.board_id');
  const dataBody = _.get(req, 'body.request');

  // Validate request body
  const isRequestValid = schemaValidation(requestBody, boardUpdateJson);
  if (!isRequestValid.isValid) {
    const code = 'BOARD_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', 400);
  }

  // Validate board existence
  const board = await boardService.getBoardByIdentifier(board_id);
  if (_.isEmpty(board)) {
    const code = 'BOARD_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: 'Board does not exist' });
    throw amlError(code, 'Board does not exist', 'NOT_FOUND', 404);
  }

  // Initialize updatedData with the current board data
  const updatedData = {
    ...board,
    ...dataBody,
  };

  // Handle `class_ids` as an array of objects
  if (dataBody.class_ids && _.isArray(dataBody.class_ids)) {
    updatedData.class_ids = [];

    // Iterate through each class object in the array
    for (const classObj of dataBody.class_ids) {
      const { id, l1_skill_ids, sequence_no } = classObj;
      const updatedClassObj: any = {};

      if (id) {
        const isExists = await getClassById(id);
        if (!isExists) {
          const code = 'CLASS_ID_NOT_EXISTS';
          logger.error({ code, apiId, msgid, resmsgid, message: `Class ID ${id} does not exist` });
          throw amlError(code, `Class ID ${id} does not exist`, 'NOT_FOUND', 404);
        }
        updatedClassObj.id = id;
      }

      if (l1_skill_ids) {
        const isL1Exists = await checkSkillsExistByIds(l1_skill_ids);
        if (!isL1Exists) {
          const code = 'L1_SKILL_NOT_EXISTS';
          logger.error({ code, apiId, msgid, resmsgid, message: `One or more L1 skills for class ID ${id} do not exist or are not of type l1_skill` });
          throw amlError(code, 'One or more L1 skills do not exist or are not of type l1_skill', 'NOT_FOUND', 404);
        }
        updatedClassObj.l1_skill_ids = l1_skill_ids;
      }

      if (sequence_no) {
        updatedClassObj.sequence_no = sequence_no;
      }

      updatedData.class_ids.push(updatedClassObj);
    }
  }

  await boardService.updateBoardData(board_id, updatedData);

  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { message: 'Board Successfully Updated' } });
};

export default updateBoard;
