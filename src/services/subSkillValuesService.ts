import { Transaction } from 'sequelize';
import { SubSkillValues } from '../models/subSkillValues';

class SubSkillValuesService {
  static getInstance() {
    return new SubSkillValuesService();
  }

  async create(data: { identifier: string; sub_skill_id: string; skill_value_name: string | null; sequence: number; created_by: string }, transaction: Transaction) {
    return SubSkillValues.create(data, { transaction });
  }

  async findBySkillIdAndName(subSkillId: string, subSkillValueName: string | null) {
    return SubSkillValues.findOne({
      where: {
        sub_skill_id: subSkillId,
        skill_value_name: subSkillValueName,
      },
    });
  }
}

export const subSkillValuesService = SubSkillValuesService.getInstance();
