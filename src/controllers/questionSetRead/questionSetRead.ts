import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { questionSetService } from '../../services/questionSetService';
import { amlError } from '../../types/amlError';
import { ResponseHandler } from '../../utils/responseHandler';
import { questionService } from '../../services/questionService';
import { Question } from '../../models/question';
import { QuestionType } from '../../enums/questionType';
import { getFileUrlByFolderAndFileName } from '../../services/awsService';
import { getContentByIds } from '../../services/content';
import { FIBType } from '../../enums/fibType';
import { UserTransformer } from '../../transformers/entity/user.transformer';
import { questionSetQuestionMappingService } from '../../services/questionSetQuestionMappingService';
import { userService } from '../../services/userService';
import { ContentTransformer } from '../../transformers/entity/contentTransformer';

const readQuestionSetById = async (req: Request, res: Response) => {
  const apiId = _.get(req, 'id');
  const questionSet_id = _.get(req, 'params.question_set__id');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');

  const questionSet = await questionSetService.getQuestionSetByIdAndStatus(questionSet_id);

  // Validating if question set exists
  if (_.isEmpty(questionSet)) {
    const code = 'QUESTION_SET_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: `Question Set not exists` });
    throw amlError(code, 'Question Set not exists', 'NOT_FOUND', 404);
  }

  const mappings = await questionSetQuestionMappingService.getEntriesForQuestionSetId(questionSet_id);
  const questionIds = mappings.map((mapping) => mapping.question_id);
  const questionsDetails = await questionService.getQuestionsByIdentifiers(questionIds);

  const contentIds = questionSet.content_ids;
  const contents = contentIds && contentIds?.length > 0 ? await getContentByIds(contentIds) : [];

  // Create a map of questions by their identifier for easy lookup
  const questionsMap: { [key: string]: any } = new Map(
    questionsDetails.map((q: Question): any => {
      if (
        (q.question_type === QuestionType.MCQ ||
          (q.question_type === QuestionType.FIB && [FIBType.FIB_STANDARD_WITH_IMAGE, FIBType.FIB_QUOTIENT_REMAINDER_WITH_IMAGE].includes(q.question_body.answers?.fib_type))) &&
        q?.question_body?.question_image
      ) {
        const { src, fileName } = q.question_body.question_image;
        return [q.identifier, { ...q, question_body: { ...q.question_body, question_image_url: getFileUrlByFolderAndFileName(src, fileName) } }];
      }
      return [q.identifier, q];
    }),
  );

  const contentTransformer = new ContentTransformer();

  // Combine the question set details with the question details, sorted by sequence
  const questionSetWithQuestions = {
    ...questionSet,
    contents: contentTransformer.transformList(contents).reduce((agg: Record<string, string[]>, curr) => {
      (curr.media || []).forEach((media) => {
        const url = getFileUrlByFolderAndFileName(media.src, media.fileName);
        const lang = media.language; // `language` is always present due to transformer

        if (!agg[lang]) {
          agg[lang] = [];
        }
        agg[lang].push(url);
      });
      return agg;
    }, {}),
    questions: mappings
      .map((mapping): Question => questionsMap.get(mapping.question_id))
      .filter(Boolean)
      .sort((a, b) => {
        const sequenceA = mappings.find((mapping) => mapping.question_id === a.identifier)?.sequence || 0;
        const sequenceB = mappings.find((mapping) => mapping.question_id === b.identifier)?.sequence || 0;
        return sequenceA - sequenceB;
      }),
  };

  const users = await userService.getUsersByIdentifiers(([questionSet?.created_by, questionSet?.updated_by] as any[]).filter((v) => !!v));

  const transformedUsers = new UserTransformer().transformList(users);

  logger.info({ apiId, questionSet_id, message: `Question Set read successfully` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { question_set: questionSetWithQuestions, users: transformedUsers } });
};

export default readQuestionSetById;
