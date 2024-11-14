import { LearnerProficiencyAggregateData } from '../models/learnerProficiencyAggregateData';

export const findAggregateData = async (filters: {
  learner_id?: string;
  class_id?: string;
  l1_skill_id?: string;
  l2_skill_id?: string;
  l3_skill_id?: string;
}): Promise<LearnerProficiencyAggregateData | null> => {
  return LearnerProficiencyAggregateData.findOne({
    where: { ...filters },
    attributes: { exclude: ['id'] },
    raw: true,
  });
};

export const createAggregateData = async (transaction: any, req: any): Promise<any> => {
  return LearnerProficiencyAggregateData.create(req, { transaction });
};

export const updateAggregateData = async (transaction: any, identifier: string, req: any): Promise<any> => {
  return LearnerProficiencyAggregateData.update(req, {
    where: { identifier },
    transaction,
  });
};
