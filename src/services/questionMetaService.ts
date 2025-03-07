import { QuestionMeta } from '../models/questionMeta';
import { Transaction } from 'sequelize';

class QuestionMetaService {
  static getInstance() {
    return new QuestionMetaService();
  }

  async create(data: { question_group_id: string; complexity_score: number; sub_skill_value_ids: string[]; meta: any; created_by: string }, transaction?: Transaction) {
    return QuestionMeta.create(data, { transaction });
  }
}

export const questionMetaService = QuestionMetaService.getInstance();
