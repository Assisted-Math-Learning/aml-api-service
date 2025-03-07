import { Transaction } from 'sequelize';
import { SubSkillMaster } from '../models/subSkillMaster';

class SubSkillMasterService {
  static getInstance() {
    return new SubSkillMasterService();
  }

  async create(data: { identifier: string; topic: string; skill_name: string; skill_type: string; sequence: number; created_by: string }, transaction: Transaction) {
    await SubSkillMaster.create(data, { transaction });
  }

  async findByTopicAndName(topic: string, name: string) {
    return SubSkillMaster.findOne({
      where: {
        topic,
        skill_name: name,
      },
    });
  }
}

export const subSkillMasterService = SubSkillMasterService.getInstance();
