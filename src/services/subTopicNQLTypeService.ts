import { Transaction } from 'sequelize';
import { SubTopicNQLTypeMapping } from '../models/subTopicNQLTypeMapping';

class SubTopicNQLTypeMappingService {
  static getInstance() {
    return new SubTopicNQLTypeMappingService();
  }

  async create(data: { topic: string; sub_topic_id: string; question_type: string; nql_type: string; created_by: string }, transaction?: Transaction) {
    return SubTopicNQLTypeMapping.create(data, { transaction });
  }
}

export const subTopicNQLTypeMappingService = SubTopicNQLTypeMappingService.getInstance();
