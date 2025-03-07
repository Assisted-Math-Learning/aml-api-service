import { Transaction } from 'sequelize';
import { SubTopicHierarchy } from '../models/subTopicHierarchy';

class SubTopicHierarchyService {
  static getInstance() {
    return new SubTopicHierarchyService();
  }

  async create(
    data: {
      topic: string;
      sub_topic_id: string;
      class_id: string;
      sequence: number;
      question_types: { question_type: string; sequence: number }[];
      include_in_diagnostic: boolean;
      created_by: string;
    },
    transaction: Transaction,
  ) {
    return SubTopicHierarchy.create(data, { transaction });
  }
}

export const subTopicHierarchyService = SubTopicHierarchyService.getInstance();
