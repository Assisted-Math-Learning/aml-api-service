import { QuestionSet } from '../../models/questionSet';
import { Sequelize } from 'sequelize';
import { ResponseHandler } from '../../utils/responseHandler';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { QuestionSetQuestionMapping } from '../../models/questionSetQuestionMapping';
import { AppDataSource } from '../../config';

const createQuestionSetQuestionMapping = async (req: Request, res: Response) => {
  const questionSets = await QuestionSet.findAll({
    where: Sequelize.literal(`
      jsonb_typeof(questions) = 'array' AND jsonb_array_length(questions) > 0
    `),
    limit: 100,
  });

  const promises1: any[] = [];
  const promises2: any[] = [];

  const transaction = await AppDataSource.transaction();

  for (const questionSet of questionSets) {
    const { questions } = questionSet;
    questions.forEach((question) => {
      const promise = QuestionSetQuestionMapping.create(
        {
          question_set_id: questionSet.identifier,
          question_id: question.identifier,
          sequence: question.sequence,
          created_by: 'manual',
        },
        { transaction },
      );
      promises1.push(promise);
    });
    const promise = QuestionSet.update(
      { questions: [] },
      {
        where: {
          identifier: questionSet.identifier,
        },
        transaction,
      },
    );
    promises2.push(promise);
  }

  try {
    await Promise.all(promises1);
    await Promise.all(promises2);
    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
  }

  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { success: true } });
};

export default createQuestionSetQuestionMapping;
