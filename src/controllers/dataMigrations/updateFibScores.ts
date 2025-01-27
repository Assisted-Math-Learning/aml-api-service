import { Request, Response } from 'express';
import { ResponseHandler } from '../../utils/responseHandler';
import httpStatus from 'http-status';
import { Question } from '../../models/question';
import { QuestionType } from '../../enums/questionType';
import _ from 'lodash';
import { LearnerProficiencyQuestionLevelData } from '../../models/learnerProficiencyQuestionLevelData';
import { QuestionOperation } from '../../enums/questionOperation';
import { AppDataSource } from '../../config';
import { Op } from 'sequelize';

const updateFibScores = async (req: Request, res: Response) => {
  const fibTypeQuestions = await Question.findAll({
    where: {
      question_type: QuestionType.FIB,
    },
  });

  const questionsMap = {};
  const questionIds: string[] = [];

  for (const question of fibTypeQuestions) {
    _.set(questionsMap, question.identifier, question);
    questionIds.push(question.identifier);
  }

  const learnerAttempts = await LearnerProficiencyQuestionLevelData.findAll({
    where: {
      question_id: questionIds,
      score: 0,
      created_at: {
        [Op.gte]: '20250117',
      },
    },
  });

  const promises = [];
  const transaction = await AppDataSource.transaction();

  for (const attempt of learnerAttempts) {
    let score = 0;
    const question: Question = _.get(questionsMap, attempt.question_id);
    const { question_body, operation } = question;
    const { answers } = question_body;
    const { result } = answers;

    const { learner_response } = attempt;
    const { result: lrResult, quotient: lrQuotient, remainder: lrRemainder } = learner_response;

    if (operation === QuestionOperation.DIVISION) {
      const { quotient, remainder } = result;
      if (quotient.toString() && remainder.toString() && lrQuotient?.toString() && lrRemainder?.toString()) {
        score = quotient.toString() === lrQuotient?.toString() && remainder.toString() === lrRemainder?.toString() ? 1 : 0;
      }
    } else {
      if (result?.toString() && lrResult?.toString()) {
        score = result.toString() === lrResult.toString() ? 1 : 0;
      }
    }

    if (score) {
      promises.push(
        attempt.update(
          {
            score,
          },
          { transaction },
        ),
      );
    }
  }

  try {
    await Promise.all(promises);
    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
  }

  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { success: true, rows_affected: promises.length } });
};

export default updateFibScores;
