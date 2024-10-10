import { Op, Optional } from 'sequelize';
import { Status } from '../enums/status';
import { Question } from '../models/question';
import { QuestionSet } from '../models/questionSet';
import _ from 'lodash';
import { QuestionSetPurposeType } from '../enums/questionSetPurposeType';

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
        where: filters.question_type ? questionWhereClause : undefined,
        required: !!filters.question_type,

        attributes: { exclude: ['id'] },
      },
    ],
    attributes: { exclude: ['id'] },
  });

  return questionSets;
};

export const getQuestionSetsByIdentifiers = async (identifiers: string[]): Promise<any> => {
  return QuestionSet.findAll({
    where: {
      identifier: {
        [Op.in]: identifiers,
      },
    },
    attributes: { exclude: ['id'] },
    raw: true,
  });
};

export const getMainDiagnosticQuestionSet = async (filters: { board?: string; class?: string; l1Skill?: string }): Promise<any> => {
  let whereClause: any = {
    purpose: QuestionSetPurposeType.MAIN_DIAGNOSTIC,
  };

  if (filters.board) {
    whereClause = {
      ...whereClause,
      taxonomy: {
        ...(whereClause.taxonomy || {}),
        board: {
          name: {
            en: filters.board,
          },
        },
      },
    };
  }

  if (filters.class) {
    whereClause = {
      ...whereClause,
      taxonomy: {
        ...(whereClause.taxonomy || {}),
        class: {
          name: {
            en: filters.class,
          },
        },
      },
    };
  }

  if (filters.l1Skill) {
    whereClause = {
      ...whereClause,
      taxonomy: {
        ...(whereClause.taxonomy || {}),
        l1_skill: {
          name: {
            en: filters.l1Skill,
          },
        },
      },
    };
  }

  return QuestionSet.findOne({
    where: whereClause,
    attributes: { exclude: ['id'] },
    raw: true,
  });
};

export const getPracticeQuestionSet = (filters: { board: string; class: string; l1Skill: string }): Promise<any> => {
  const whereClause: any = {
    purpose: {
      [Op.ne]: QuestionSetPurposeType.MAIN_DIAGNOSTIC,
    },
    taxonomy: {
      board: {
        name: {
          en: filters.board,
        },
      },
      class: {
        name: {
          en: filters.class,
        },
      },
      l1_skill: {
        name: {
          en: filters.l1Skill,
        },
      },
    },
  };

  return QuestionSet.findOne({
    where: whereClause,
    order: [['sequence', 'ASC']],
  });
};

export const getNextPracticeQuestionSetInSequence = (filters: { board: string; classes: string[]; l1Skill: string; lastSetSequence: number }): Promise<any> => {
  const whereClause: any = {
    sequence: {
      [Op.gt]: filters.lastSetSequence,
    },
    purpose: {
      [Op.ne]: QuestionSetPurposeType.MAIN_DIAGNOSTIC,
    },
    taxonomy: {
      board: {
        name: {
          en: filters.board,
        },
      },
      class: {
        name: {
          en: {
            [Op.in]: filters.classes,
          },
        },
      },
      l1_skill: {
        name: {
          en: filters.l1Skill,
        },
      },
    },
  };

  return QuestionSet.findOne({
    where: whereClause,
    order: [['sequence', 'ASC']],
  });
};
