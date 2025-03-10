import { Transaction } from 'sequelize';
import { SequentialNQLDetails } from '../models/sequentialNQLDetails';

class SequentialNQLDetailsService {
  static getInstance() {
    return new SequentialNQLDetailsService();
  }

  async create(data: { nql_type_mapping_id: string; class_id: string; question_set_x_id: string; sequence: number; created_by: string }, transaction?: Transaction) {
    return SequentialNQLDetails.create(data, { transaction });
  }
}

export const sequentialNQLDetailsService = SequentialNQLDetailsService.getInstance();
