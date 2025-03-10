import { Request, Response } from 'express';
import _ from 'lodash';
import { amlError } from '../../types/amlError';
import { getCSVEntries } from './helper';
import { AppDataSource } from '../../config';
import { subTopicService } from '../../services/subTopicService';
import { Question } from '../../models/question';
import { ResponseHandler } from '../../utils/responseHandler';
import httpStatus from 'http-status';

const initializeSubTopicIdsAndQuestionGroupId = async (req: Request, res: Response) => {
  const csvFile = _.get(req, ['files', 'document'], {});

  if (!csvFile) {
    const code = 'UPLOAD_INVALID_INPUT';
    throw amlError(code, 'document missing', 'BAD_REQUEST', 400);
  }
  const rows = getCSVEntries(csvFile);
  const transaction = await AppDataSource.transaction();

  const questionXIDHeaderIndex = rows[0].findIndex((header) => header === 'QID');
  const questionGroupIdsHeaderIndex = rows[0].findIndex((header) => header === 'unique_question_id');
  const subTopicsHeaderIndex = rows[0].findIndex((header) => header === 'Sub-topic');

  const subTopicMap = {};

  try {
    for (const row of rows.slice(1)) {
      const questionXID = row[questionXIDHeaderIndex];
      const subTopics = row[subTopicsHeaderIndex]
        .split('#')
        .map((t) => t.trim())
        .filter((v) => !!v);
      const questionGroupId = row[questionGroupIdsHeaderIndex];

      const subTopicIdentifiers: string[] = [];

      for (const subTopic of subTopics) {
        let subTopicIdentifier = _.get(subTopicMap, subTopic);
        if (!subTopicIdentifier) {
          const subTopicExists = await subTopicService.findByName(subTopic);
          if (!subTopicExists) {
            const code = 'INVALID_SUB_TOPIC';
            throw amlError(code, `Invalid sub_topic ${subTopic}`, 'BAD_REQUEST', 400);
          }
          subTopicIdentifier = subTopicExists.dataValues.identifier;
          _.set(subTopicMap, subTopic, subTopicIdentifier);
        }
        subTopicIdentifiers.push(subTopicIdentifier);
      }

      await Question.update(
        {
          sub_topic_ids: subTopicIdentifiers,
          question_group_id: questionGroupId ? questionGroupId : null,
        },
        {
          where: {
            x_id: questionXID,
          },
          transaction,
        },
      );
    }
    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    throw e;
  }

  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { success: true } });
};

export default initializeSubTopicIdsAndQuestionGroupId;
