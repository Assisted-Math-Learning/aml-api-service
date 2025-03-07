import { Transaction } from 'sequelize';
import { AccuracyThresholds } from '../models/accuracyThresholds';

class AccuracyThresholdService {
  static getInstance() {
    return new AccuracyThresholdService();
  }

  async create(data: { topic: string; sub_topic_id: string; question_type: string; threshold: any; created_by: string }, transaction?: Transaction) {
    await AccuracyThresholds.create(data, { transaction });
  }
}

export const accuracyThresholdService = AccuracyThresholdService.getInstance();
