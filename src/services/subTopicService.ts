import { SubTopicMaster } from '../models/subTopicMaster';
import { Transaction } from 'sequelize';

class SubTopicService {
  static getInstance() {
    return new SubTopicService();
  }

  async findByName(name: string) {
    return SubTopicMaster.findOne({
      where: { name },
      attributes: ['identifier'],
    });
  }

  async create(data: { identifier: string; name: string; created_by: string }, transaction?: Transaction) {
    return SubTopicMaster.create(data, { transaction });
  }
}

export const subTopicService = SubTopicService.getInstance();
