import { Op, Optional } from 'sequelize';
import { Status } from '../enums/status';
import { Question } from '../models/question';
import { QuestionSet } from '../models/questionSet';
import _ from 'lodash';

// Get a single question by ID
export const getQuestionSetById = async (id: string): Promise<any> => {
  const whereClause = {
    identifier: id,
  };

  const questionSetDetails = await QuestionSet.findOne({
    where: whereClause,
    attributes: { exclude: ['id'] },
    raw: true,
  });

  return questionSetDetails;
};

//Get question by Status
// Get a single question by ID
export const getQuestionSetByIdAndStatus = async (id: string, additionalConditions: object = {}): Promise<any> => {
  // Combine base conditions with additional conditions
  const conditions = {
    identifier: id,
    ...additionalConditions, // Spread additional conditions here
  };

  const questionSetDetails = await QuestionSet.findOne({
    where: conditions,
    attributes: { exclude: ['id'] },
  });

  return questionSetDetails?.dataValues;
};

// Create a new question set
export const createQuestionSetData = async (req: Optional<any, string> | undefined): Promise<any> => {
  const insertQuestionSet = await QuestionSet.create(req);
  return insertQuestionSet.dataValues;
};

// Get a single question set by name
export const getQuestionSetByName = async (title: string): Promise<any> => {
  const getQuestionSet = await QuestionSet.findOne({ where: { title }, raw: true });
  return { error: false, getQuestionSet };
};

// Update a single question set
export const updateQuestionSet = async (questionIdentifier: string, updatedata: any): Promise<any> => {
  // Update the question in the database
  return await QuestionSet.update(updatedata, {
    where: { identifier: questionIdentifier },
  });
};

// Publish question set
export const publishQuestionSetById = async (id: string): Promise<any> => {
  const questionSetDetails = await QuestionSet.update({ status: Status.LIVE }, { where: { identifier: id }, returning: true });
  return questionSetDetails;
};

// Delete a question set (soft delete)
export const deleteQuestionSet = async (id: string): Promise<any> => {
  const questionSetDetails = await QuestionSet.update({ is_active: false }, { where: { identifier: id }, returning: true });
  return questionSetDetails;
};

// Discard question set (hard delete)
export const discardQuestionSet = async (id: string): Promise<any> => {
  const questionSet = await QuestionSet.destroy({
    where: { identifier: id },
  });
  return questionSet;
};

// Get list of question sets with optional filters
export const getQuestionSetList = async (req: Record<string, any>) => {
  const limit: number = _.get(req, 'limit', 100);
  const offset: number = _.get(req, 'offset', 0);
  const { filters = {} } = req || {};

  const whereClause: any = {
    status: Status.LIVE,
    is_active: true,
  };

  if (filters.title) {
    whereClause.title = {
      [Op.or]: filters.title.map((termObj: any) => {
        const [key, value] = Object.entries(termObj)[0];
        return {
          [key]: { [Op.iLike]: `%${String(value)}%` },
        };
      }),
    };
  }

  const questionWhereClause: any = {
    status: Status.LIVE,
  };

  if (filters.question_type) {
    questionWhereClause.question_type = {
      [Op.or]: filters.question_type.map((type: string) => ({
        [Op.iLike]: `%${type}%`,
      })),
    };
  }

  const questionSets = await QuestionSet.findAll({
    limit,
    offset,
    where: whereClause,
    include: [
      {
        model: Question,
        as: 'questions',
        where: questionWhereClause,
        required: true,
        attributes: { exclude: ['id'] },
      },
    ],
    attributes: { exclude: ['id'] },
  });

  return questionSets;
};
