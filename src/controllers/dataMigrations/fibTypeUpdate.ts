import { Request, Response } from 'express';
import { Question } from '../../models/question';
import { QuestionType } from '../../enums/questionType';
import { AppDataSource } from '../../config';
import { FIBType } from '../../enums/fibType';
import { QuestionOperation } from '../../enums/questionOperation';
import { ResponseHandler } from '../../utils/responseHandler';
import httpStatus from 'http-status';

const fibTypeUpdate = async (req: Request, res: Response) => {
  const fibTypeQuestions = await Question.findAll({
    where: {
      question_type: QuestionType.FIB,
    },
  });

  const promises = [];
  const transaction = await AppDataSource.transaction();

  for (const question of fibTypeQuestions) {
    const { question_body, operation } = question;
    const { answers } = question_body;
    let fibType = '';
    if (!Object.prototype.hasOwnProperty.call(answers, 'fib_type')) {
      fibType = FIBType.FIB_STANDARD;
    }

    if (operation === QuestionOperation.DIVISION) {
      if (Object.prototype.hasOwnProperty.call(answers, 'fib_type')) {
        if (`${answers.fib_type}` === '1') {
          fibType = FIBType.FIB_STANDARD;
        }
        if (`${answers.fib_type}` === '2') {
          fibType = FIBType.FIB_QUOTIENT_REMAINDER;
        }
      }
    }

    if (fibType) {
      promises.push(
        question.update(
          {
            question_body: {
              ...question_body,
              answers: {
                ...answers,
                fib_type: fibType,
              },
            },
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

export default fibTypeUpdate;
