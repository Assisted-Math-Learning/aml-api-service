import { Transaction } from 'sequelize';
import { AccuracyThresholdBasedNQLDetails } from '../models/accuracyThresholdBasedNQLDetails';

class AccuracyThresholdBasedNQLDetailsService {
  static getInstance() {
    return new AccuracyThresholdBasedNQLDetailsService();
  }

  async create(data: { nql_type_mapping_id: string; num_of_questions_to_give: number; created_by: string }, transaction?: Transaction) {
    return AccuracyThresholdBasedNQLDetails.create(data, { transaction });
  }
}

export const accuracyThresholdBasedNQLDetailsService = AccuracyThresholdBasedNQLDetailsService.getInstance();
