import { Op, Optional } from 'sequelize';
import * as _ from 'lodash';
import { Question } from '../models/question';
import { Status } from '../enums/status';
import { DEFAULT_LIMIT } from '../constants/constants';
import { questionSetService } from './questionSetService';
import { Sequelize } from 'sequelize-typescript';

class QuestionService {
  static getInstance() {
    return new QuestionService();
  }

  async createQuestionData(req: Optional<any, string>) {
    return Question.create(req);
  }

  async getQuestionById(id: string, additionalConditions: object = {}) {
    // Combine base conditions with additional conditions
    const conditions = {
      identifier: id,
      ...additionalConditions, // Spread additional conditions here
    };

    return Question.findOne({
      where: conditions,
      attributes: { exclude: ['id'] },
      raw: true,
    });
  }

  async updateQuestionData(questionIdentifier: string, updateData: any) {
    // Update the question in the database
    return Question.update(updateData, {
      where: { identifier: questionIdentifier },
    });
  }

  async publishQuestionById(id: string) {
    return Question.update({ status: Status.LIVE }, { where: { identifier: id }, returning: true });
  }

  async deleteQuestion(id: string) {
    return Question.update({ is_active: false }, { where: { identifier: id }, returning: true });
  }

  async discardQuestion(id: string) {
    return Question.destroy({
      where: { identifier: id },
    });
  }

  async getQuestionList(req: {
    filters: {
      is_active?: boolean;
      status?: Status;
      search_query?: string;
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
  }) {
    const limit: any = _.get(req, 'limit');
    const offset: any = _.get(req, 'offset');
    const { filters = {} } = req || {};

    let whereClause: any = {
      is_active: true,
    };

    if (Object.prototype.hasOwnProperty.call(filters, 'is_active')) {
      whereClause = {
        ...whereClause,
        is_active: filters.is_active,
      };
    }

    if (filters.status) {
      whereClause = {
        ...whereClause,
        status: filters.status,
      };
    }

    if (filters.search_query) {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          Sequelize.literal(`
    EXISTS (
      SELECT 1 
      FROM jsonb_each_text(name) AS kv
      WHERE LOWER(kv.value) LIKE '%${filters.search_query.toLowerCase()}%'
    )
  `),
          Sequelize.literal(`
    EXISTS (
      SELECT 1 
      FROM jsonb_each_text(description) AS kv
      WHERE LOWER(kv.value) LIKE '%${filters.search_query.toLowerCase()}%'
    )
  `),
        ],
      };
    }

    if (filters.repository_id) {
      whereClause = _.set(whereClause, ['repository', 'identifier'], filters.repository_id);
    }

    if (filters.question_type) {
      whereClause = _.set(whereClause, ['question_type'], filters.question_type);
    }

    if (filters.question_set_id) {
      const questionSet = await questionSetService.getQuestionSetById(filters.question_set_id);
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
      order: [['updated_at', 'desc']],
    });

    return {
      questions: rows,
      meta: {
        offset: finalOffset,
        limit: finalLimit,
        total: count,
      },
    };
  }

  async getQuestionsByIdentifiers(identifiers: string[]) {
    return Question.findAll({
      where: {
        identifier: {
          [Op.in]: identifiers,
        },
      },
      attributes: { exclude: ['id'] },
      raw: true,
    });
  }

  async checkQuestionsExist(questionIdentifiers: string[]): Promise<{ exists: boolean; foundQuestions?: any[] }> {
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
  }
}

export const questionService = QuestionService.getInstance();
