import { Request, Response } from 'express';
import _ from 'lodash';
import { amlError } from '../../types/amlError';
import { getCSVEntries } from './helper';
import { AppDataSource } from '../../config';
import { subTopicService } from '../../services/subTopicService';
import { QuestionOperation } from '../../enums/questionOperation';
import { QuestionType } from '../../enums/questionType';
import { NQLType } from '../../enums/nqlType';
import { subTopicNQLTypeMappingService } from '../../services/subTopicNQLTypeService';
import { ResponseHandler } from '../../utils/responseHandler';
import httpStatus from 'http-status';
import * as uuid from 'uuid';

const initializeSubTopicNQLTypeTable = async (req: Request, res: Response) => {
  const csvFile = _.get(req, ['files', 'document'], {});

  if (!csvFile) {
    const code = 'UPLOAD_INVALID_INPUT';
    throw amlError(code, 'document missing', 'BAD_REQUEST', 400);
  }
  const rows = getCSVEntries(csvFile);
  const transaction = await AppDataSource.transaction();

  const subTopicMap = {};

  try {
    for (const row of rows.slice(1)) {
      const [topic, subTopic, questionType, nqlType] = row;

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

      if (!Object.values(QuestionType).includes(questionType as QuestionType)) {
        const code = 'INVALID_QUESTION_TYPE';
        throw amlError(code, `Invalid QuestionType ${questionType}`, 'BAD_REQUEST', 400);
      }

      if (!Object.values(NQLType).includes(nqlType as NQLType)) {
        const code = 'INVALID_NQL_TYPE';
        throw amlError(code, `Invalid NQLType ${nqlType}`, 'BAD_REQUEST', 400);
      }

      await subTopicNQLTypeMappingService.create(
        {
          identifier: uuid.v4(),
          topic,
          sub_topic_id: subTopicIdentifier,
          question_type: questionType,
          nql_type: nqlType,
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

export default initializeSubTopicNQLTypeTable;
