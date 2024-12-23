import { Op, Optional } from 'sequelize';
import * as _ from 'lodash';
import { Question } from '../models/question';
import { Status } from '../enums/status';
import { DEFAULT_LIMIT } from '../constants/constants';
import { getQuestionSetById } from './questionSet';

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

export const getQuestionList = async (req: {
  filters: {
    repository_id?: string;
    question_type?: string[];
    question_set_id?: string;
    board_id?: string;
    class_id?: string;
    l1_skill_id?: string;
    l2_skill_id?: string;
    l3_skill_id?: string;
    sub_skill_id?: string;
  };
  limit?: number;
  offset?: number;
}) => {
  const limit: any = _.get(req, 'limit');
  const offset: any = _.get(req, 'offset');
  const { filters = {} } = req || {};

  let whereClause: any = {
    status: Status.LIVE,
  };

  if (filters.repository_id) {
    whereClause = _.set(whereClause, ['repository', 'identifier'], filters.repository_id);
  }

  if (filters.question_type) {
    whereClause = _.set(whereClause, ['question_type'], filters.question_type);
  }

  if (filters.question_set_id) {
    const questionSet = await getQuestionSetById(filters.question_set_id);
    if (questionSet) {
      const { questions } = questionSet;
      const questionIds = questions.map((question) => question.identifier);
      whereClause = _.set(whereClause, ['identifier'], questionIds);
    }
  }

  if (filters.board_id) {
    whereClause = _.set(whereClause, ['taxonomy', 'board', 'identifier'], filters.board_id);
  }

  if (filters.class_id) {
    whereClause = _.set(whereClause, ['taxonomy', 'class', 'identifier'], filters.class_id);
  }

  if (filters.l1_skill_id) {
    whereClause = _.set(whereClause, ['taxonomy', 'l1_skill', 'identifier'], filters.l1_skill_id);
  }

  if (filters.l2_skill_id) {
    whereClause = {
      ...whereClause,
      taxonomy: {
        [Op.contains]: {
          l2_skill: [{ identifier: filters.l2_skill_id }],
        },
      },
    };
  }

  if (filters.l3_skill_id) {
    whereClause = {
      ...whereClause,
      taxonomy: {
        [Op.contains]: {
          l3_skill: [{ identifier: filters.l3_skill_id }],
        },
      },
    };
  }

  const finalLimit = limit || DEFAULT_LIMIT;
  const finalOffset = offset || 0;

  const { rows, count } = await Question.findAndCountAll({
    where: whereClause,
    limit: finalLimit,
    offset: finalOffset,
    attributes: { exclude: ['id'] },
    raw: true,
  });

  return {
    questions: rows,
    meta: {
      offset: finalOffset,
      limit: finalLimit,
      total: count,
    },
  };
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

export const getAllQuestionsByIdentifiers = async (is: string[]): Promise<any> => {
  return Question.findAll({
    where: {
      identifier: {
        [Op.in]: is,
      },
    },
    attributes: { exclude: ['id'] },
    raw: true,
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
