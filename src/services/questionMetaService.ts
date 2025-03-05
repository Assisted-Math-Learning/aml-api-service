import { QuestionMeta } from '../models/questionMeta';
import { Transaction } from 'sequelize';

class QuestionMetaService {
  static getInstance() {
    return new QuestionMetaService();
  }

  async create(data: { question_x_id: string; meta: { complexity_score: number; sub_topic_ids: string[] }; created_by: string }, transaction?: Transaction) {
    return QuestionMeta.create(data, { transaction });
  }
}

export const questionMetaService = QuestionMetaService.getInstance();
