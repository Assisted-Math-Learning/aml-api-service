import { Request, Response } from 'express';
import { ResponseHandler } from '../../utils/responseHandler';
import httpStatus from 'http-status';
import _ from 'lodash';
import { amlError } from '../../types/amlError';
import { getCSVEntries } from './helper';
import { AppDataSource } from '../../config';
import { subTopicService } from '../../services/subTopicService';
import { questionMetaService } from '../../services/questionMetaService';

const initializeQuestionMetaTable = async (req: Request, res: Response) => {
  const csvFile = _.get(req, ['files', 'document'], {});

  if (!csvFile) {
    const code = 'UPLOAD_INVALID_INPUT';
    throw amlError(code, 'document missing', 'BAD_REQUEST', 400);
  }
  const rows = getCSVEntries(csvFile);
  const transaction = await AppDataSource.transaction();
  const questionXIDIndex = rows[0].findIndex((column) => column === 'question_id');
  const complexityScoreIndex = rows[0].findIndex((column) => column === 'complexity_score');
  const subTopicsIndex = rows[0].findIndex((column) => column === 'sub_topics');

  const subTopicMap = {};

  try {
    for (const row of rows.slice(1)) {
      const questionXID = row[questionXIDIndex];
      const complexityScore = row[complexityScoreIndex];
      const subTopics = row[subTopicsIndex].split('#');
      const subTopicIdentifiers: string[] = [];
      for (const subTopic of subTopics) {
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
        subTopicIdentifiers.push(subTopicIdentifier);
      }
      await questionMetaService.create({ question_x_id: questionXID, meta: { complexity_score: +complexityScore, sub_topic_ids: subTopicIdentifiers }, created_by: 'migration-api' }, transaction);
    }
    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    throw e;
  }

  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { success: true } });
};

export default initializeQuestionMetaTable;
