import { Request, Response } from 'express';
import { ResponseHandler } from '../../utils/responseHandler';
import httpStatus from 'http-status';
import { Question } from '../../models/question';
import { QuestionType } from '../../enums/questionType';
import { QuestionOperation } from '../../enums/questionOperation';
import { replaceAll, replaceAllNumbersInArrayWith, replaceAllNumbersWith } from '../../utils/string.util';
import { AppDataSource } from '../../config';
import * as _ from 'lodash';

const updateGrid1MetaData = async (req: Request, res: Response) => {
  const offset = _.get(req, ['body', 'offset'], 0);
  const questions = await Question.findAll({
    where: {
      question_type: QuestionType.GRID_1,
    },
    offset,
    limit: 1000,
    order: [['id', 'asc']],
  });

  const promises = [];
  const transaction = await AppDataSource.transaction();
  for (const question of questions) {
    const { operation, question_body } = question;
    const { answers } = question_body;
    switch (operation) {
      case QuestionOperation.ADDITION: {
        const { isPrefil, answerTop, answerResult } = answers;
        if (
          !Object.prototype.hasOwnProperty.call(question_body, 'grid1_show_carry') ||
          !Object.prototype.hasOwnProperty.call(question_body, 'grid1_pre_fills_top') ||
          !Object.prototype.hasOwnProperty.call(question_body, 'grid1_pre_fills_result')
        ) {
          const grid1_show_carry = isPrefil;
          const grid1_pre_fills_top = replaceAllNumbersWith(replaceAll(answerTop, '#', ''), 'F');
          const grid1_pre_fills_result = replaceAllNumbersWith(answerResult, 'F');
          promises.push(
            question.update(
              {
                question_body: {
                  ...question_body,
                  grid1_show_carry,
                  grid1_pre_fills_top,
                  grid1_pre_fills_result,
                },
              },
              { transaction },
            ),
          );
        }
        break;
      }
      case QuestionOperation.SUBTRACTION: {
        const { isPrefil, answerTop, answerResult } = answers;
        if (
          !Object.prototype.hasOwnProperty.call(question_body, 'grid1_show_regroup') ||
          !Object.prototype.hasOwnProperty.call(question_body, 'grid1_pre_fills_top') ||
          !Object.prototype.hasOwnProperty.call(question_body, 'grid1_pre_fills_result')
        ) {
          const grid1_show_regroup = isPrefil;
          const grid1_pre_fills_top = replaceAll(replaceAllNumbersInArrayWith(answerTop.split('|'), 'F').join(''), '#', '');
          const grid1_pre_fills_result = replaceAllNumbersWith(answerResult, 'F');
          promises.push(
            question.update(
              {
                question_body: {
                  ...question_body,
                  grid1_show_regroup,
                  grid1_pre_fills_top,
                  grid1_pre_fills_result,
                },
              },
              { transaction },
            ),
          );
        }
        break;
      }
      case QuestionOperation.MULTIPLICATION: {
        const { answerIntermediate, answerResult } = answers;
        if (!Object.prototype.hasOwnProperty.call(question_body, 'grid1_multiply_intermediate_steps_prefills') || !Object.prototype.hasOwnProperty.call(question_body, 'grid1_pre_fills_result')) {
          const grid1_multiply_intermediate_steps_prefills = replaceAllNumbersWith(answerIntermediate, 'F').split('#').reverse().join('#');
          const grid1_pre_fills_result = replaceAllNumbersWith(answerResult, 'F');
          promises.push(
            question.update(
              {
                question_body: {
                  ...question_body,
                  grid1_multiply_intermediate_steps_prefills,
                  grid1_pre_fills_result,
                },
              },
              { transaction },
            ),
          );
        }
        break;
      }
      case QuestionOperation.DIVISION: {
        const { answerQuotient, answerRemainder, answerIntermediate } = answers;
        if (
          !Object.prototype.hasOwnProperty.call(question_body, 'grid1_pre_fills_quotient') ||
          !Object.prototype.hasOwnProperty.call(question_body, 'grid1_pre_fills_remainder') ||
          !Object.prototype.hasOwnProperty.call(question_body, 'grid1_div_intermediate_steps_prefills')
        ) {
          const grid1_pre_fills_quotient = replaceAllNumbersWith(answerQuotient, 'F');
          const grid1_pre_fills_remainder = replaceAll(replaceAllNumbersWith(answerRemainder, 'F'), '#', '');
          const grid1_div_intermediate_steps_prefills = replaceAllNumbersWith(answerIntermediate, 'F')
            .split('|')
            .map((step) => replaceAll(step, '#', ''))
            .reverse()
            .join('#');
          promises.push(
            question.update(
              {
                question_body: {
                  ...question_body,
                  grid1_pre_fills_quotient,
                  grid1_pre_fills_remainder,
                  grid1_div_intermediate_steps_prefills,
                },
              },
              { transaction },
            ),
          );
        }
        break;
      }
    }
  }

  try {
    await Promise.all(promises);
    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
  }

  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { success: true } });
};

export default updateGrid1MetaData;
