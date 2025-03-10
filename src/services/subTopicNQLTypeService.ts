import { Transaction } from 'sequelize';
import { SubTopicNQLTypeMapping } from '../models/subTopicNQLTypeMapping';

class SubTopicNQLTypeMappingService {
  static getInstance() {
    return new SubTopicNQLTypeMappingService();
  }

  async create(data: { identifier: string; topic: string; sub_topic_id: string; question_type: string; nql_type: string; created_by: string }, transaction?: Transaction) {
    return SubTopicNQLTypeMapping.create(data, { transaction });
  }

  async find(topic: string, sub_topic_id: string, question_type: string, nql_type: string) {
    return SubTopicNQLTypeMapping.findOne({
      where: {
        topic,
        sub_topic_id,
        question_type,
        nql_type,
      },
    });
  }
}

export const subTopicNQLTypeMappingService = SubTopicNQLTypeMappingService.getInstance();
