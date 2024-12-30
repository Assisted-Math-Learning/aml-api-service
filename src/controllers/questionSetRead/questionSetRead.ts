import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { getQuestionSetByIdAndStatus } from '../../services/questionSet';
import { amlError } from '../../types/amlError';
import { ResponseHandler } from '../../utils/responseHandler';
import { questionService } from '../../services/questionService';
import { Question } from '../../models/question';
import { QuestionType } from '../../enums/questionType';
import { getFileUrlByFolderAndFileName } from '../../services/awsService';
import { getContentByIds } from '../../services/content';
import { Content } from '../../models/content';
import { FIBType } from '../../enums/fibType';

export const apiId = 'api.questionSet.read';

const readQuestionSetById = async (req: Request, res: Response) => {
  const questionSet_id = _.get(req, 'params.question_set__id');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');

  const questionSetDetails = await getQuestionSetByIdAndStatus(questionSet_id);

  // Validating if question set exists
  if (_.isEmpty(questionSetDetails)) {
    const code = 'QUESTION_SET_NOT_EXISTS';
    logger.error({ code, apiId, msgid, resmsgid, message: `Question Set not exists` });
    throw amlError(code, 'Question Set not exists', 'NOT_FOUND', 404);
  }

  const questionIds = questionSetDetails.questions.map((q: { identifier: any }) => q.identifier);
  const questionsDetails = await questionService.getQuestionsByIdentifiers(questionIds);

  const contentIds = questionSetDetails.content_ids;
  const contents = contentIds && contentIds?.length > 0 ? await getContentByIds(contentIds) : [];

  // Create a map of questions by their identifier for easy lookup
  const questionsMap = new Map(
    questionsDetails.map((q: Question): any => {
      if (
        (q.question_type === QuestionType.MCQ ||
          (q.question_type === QuestionType.FIB && [FIBType.FIB_STANDARD_WITH_IMAGE, FIBType.FIB_QUOTIENT_REMAINDER_WITH_IMAGE].includes(q.question_body.answers?.fib_type))) &&
        q?.question_body?.question_image
      ) {
        const { src, file_name } = q.question_body.question_image;
        return [q.identifier, { ...q, question_body: { ...q.question_body, question_image_url: getFileUrlByFolderAndFileName(src, file_name) } }];
      }
      return [q.identifier, q];
    }),
  );

  // Combine the question set details with the question details, sorted by sequence
  const questionSetWithQuestions = {
    ...questionSetDetails,
    contents: (contents as Content[]).reduce((agg: string[], curr) => {
      const urls = (curr.media || [])?.map((media) => getFileUrlByFolderAndFileName(media.src, media.file_name));
      agg = [...agg, ...urls];
      return agg;
    }, []),
    questions: questionSetDetails.questions
      .map((q: { identifier: any }) => questionsMap.get(q.identifier))
      .filter(Boolean)
      .sort((a: { identifier: any }, b: { identifier: any }) => {
        const sequenceA = questionSetDetails.questions.find((q: { identifier: any }) => q.identifier === a.identifier)?.sequence || 0;
        const sequenceB = questionSetDetails.questions.find((q: { identifier: any }) => q.identifier === b.identifier)?.sequence || 0;
        return sequenceA - sequenceB;
      }),
  };

  logger.info({ apiId, questionSet_id, message: `Question Set read successfully` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: questionSetWithQuestions });
};

export default readQuestionSetById;
