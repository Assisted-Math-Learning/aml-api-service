import { Transaction } from 'sequelize';
import { PrimarySkillCombinations } from '../models/primarySkillCombinations';

class PrimarySkillCombinationService {
  static getInstance() {
    return new PrimarySkillCombinationService();
  }

  async create(
    data: { identifier: string; topic: string; sub_topic_id: string; priority_level: number; level: number[]; sub_skill_value_ids: string[]; created_by: string },
    transaction?: Transaction,
  ) {
    await PrimarySkillCombinations.create(data, { transaction });
  }
}

export const primarySkillCombinationService = PrimarySkillCombinationService.getInstance();
