import { Op, Optional } from 'sequelize';
import * as _ from 'lodash';
import { Question } from '../models/question';
import { Status } from '../enums/status';

// Create a new question
export const createQuestionData = async (req: Optional<any, string>): Promise<any> => {
  const insertQuestion = await Question.create(req);
  return insertQuestion.dataValues;
};

// Get a single question by ID
export const getQuestionById = async (id: string, additionalConditions: object = {}): Promise<any> => {
  // Combine base conditions with additional conditions
  const conditions = {
    identifier: id,
    ...additionalConditions, // Spread additional conditions here
  };

  const questionDetails = await Question.findOne({
    where: conditions,
    attributes: { exclude: ['id'] },
  });

  return questionDetails?.dataValues;
};

//get Single Question by name
export const getQuestionByName = async (Question_name: string): Promise<any> => {
  const getQuestion = await Question.findOne({ where: { Question_name }, raw: true });
  return getQuestion;
};

//update single Question
export const updateQuestionData = async (questionIdentifier: string, updateData: any): Promise<any> => {
  // Update the question in the database
  return await Question.update(updateData, {
    where: { identifier: questionIdentifier },
  });
};

//publish question
export const publishQuestionById = async (id: string): Promise<any> => {
  const questionDetails = await Question.update({ status: Status.LIVE }, { where: { identifier: id }, returning: true });
  return questionDetails;
};

//delete Question
export const deleteQuestion = async (id: string): Promise<any> => {
  const questionDetails = await Question.update({ is_active: false }, { where: { identifier: id }, returning: true });
  return questionDetails;
};

//discard Question
export const discardQuestion = async (id: string): Promise<any> => {
  const question = await Question.destroy({
    where: { identifier: id },
  });

  return question;
};

export const getQuestionList = async (req: Record<string, any>) => {
  const limit: any = _.get(req, 'limit');
  const offset: any = _.get(req, 'offset');
  const { filters = {} } = req || {};
  filters.status = Status.LIVE;
  const questions = await Question.findAll({ limit: limit || 100, offset: offset || 0, ...(filters && { where: filters }), attributes: { exclude: ['id'] }, raw: true });
  return questions;
};

export const getQuestionsByIdentifiers = async (identifiers: string[]): Promise<any> => {
  return Question.findAll({
    where: {
      identifier: {
        [Op.in]: identifiers,
      },
    },
    attributes: { exclude: ['id'] },
    raw: true,
  });
};

export const getAllQuestionsById = async (is: string[]): Promise<any> => {
  return Question.findAll({
    where: {
      id: {
        [Op.in]: is,
      },
    },
    attributes: { exclude: ['id'] },
    raw: true,
  });
};
export const getQuestionsCountForQuestionSet = async (questionSetId: string): Promise<number> => {
  return Question.count({
    where: {
      question_set_id: questionSetId,
      status: Status.LIVE,
    },
  });
};

export const checkQuestionsExist = async (questionIdentifiers: string[]): Promise<{ exists: boolean; foundQuestions?: any[] }> => {
  const foundQuestions = await Question.findAll({
    where: {
      identifier: { [Op.in]: questionIdentifiers },
      is_active: true,
    },
    attributes: ['id', 'identifier'],
  });

  const foundQuestionsList = foundQuestions.map((question) => question.toJSON());

  // Check if all requested questions are found
  const exists = foundQuestions.length === questionIdentifiers.length;

  return { exists, foundQuestions: foundQuestionsList };
};
