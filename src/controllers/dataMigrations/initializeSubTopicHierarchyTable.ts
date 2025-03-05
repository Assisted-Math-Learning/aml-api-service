import { Request, Response } from 'express';
import { ResponseHandler } from '../../utils/responseHandler';
import httpStatus from 'http-status';
import _ from 'lodash';
import { amlError } from '../../types/amlError';
import { getCSVEntries } from './helper';
import { AppDataSource } from '../../config';
import { subTopicService } from '../../services/subTopicService';
import { QuestionOperation } from '../../enums/questionOperation';
import { subTopicHierarchyService } from '../../services/subTopicHierarchyService';

const initializeSubTopicHierarchyTable = async (req: Request, res: Response) => {
  const csvFile = _.get(req, ['files', 'document'], {});

  if (!csvFile) {
    const code = 'UPLOAD_INVALID_INPUT';
    throw amlError(code, 'document missing', 'BAD_REQUEST', 400);
  }
  const rows = getCSVEntries(csvFile);
  const transaction = await AppDataSource.transaction();

  const subTopicMap = {};
  const classMapping: any = {
    'class-one': '9b50a7e7-fdec-4fd7-bf63-84b3e62e4248',
    'class-two': '9b50a7e7-fdec-4fd7-bf63-84b3e62e4247',
    'class-three': '9b50a7e7-fdec-4fd7-bf63-84b3e62e4246',
    'class-four': '9b50a7e7-fdec-4fd7-bf63-84b3e62e4245',
    'class-five': '9b50a7e7-fdec-4fd7-bf63-84b3e62e4212',
    'class-six': '9b50a7e7-fdec-4fd7-bf63-84b3e62e4243',
  };

  try {
    for (const row of rows.slice(1)) {
      const [topic, subTopic, grade, sequence, questionTypes, includeInDiagnostic] = row;
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

      const classId = _.get(classMapping, grade);
      if (!classId) {
        const code = 'INVALID_GRADE';
        throw amlError(code, `Invalid grade ${grade}`, 'BAD_REQUEST', 400);
      }

      const questionTypesAndSequences = questionTypes.split('#').reduce((agg: any[], curr) => {
        const [questionType, order] = curr.split('_');
        agg.push({ question_type: questionType, sequence: order });
        return agg;
      }, []);

      const includeQuestionTypeInDiagnostic = includeInDiagnostic === 'yes';

      await subTopicHierarchyService.create(
        {
          topic,
          sub_topic_id: subTopicIdentifier,
          class_id: classId,
          sequence: +sequence,
          question_types: questionTypesAndSequences,
          include_in_diagnostic: includeQuestionTypeInDiagnostic,
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

export default initializeSubTopicHierarchyTable;
