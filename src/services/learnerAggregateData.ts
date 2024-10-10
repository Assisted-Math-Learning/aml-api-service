import { LearnerProficiencyAggregateData } from '../models/learnerProficiencyAggregateData';

export const findAggregateData = async (filters: { learner_id?: string; class?: string; l1_skill?: string; l2_skill?: string; l3_skill?: string }): Promise<LearnerProficiencyAggregateData | null> => {
  return LearnerProficiencyAggregateData.findOne({
    where: { ...filters },
    attributes: { exclude: ['id'] },
    raw: true,
  });
};

export const createAggregateData = async (req: any): Promise<any> => {
  return LearnerProficiencyAggregateData.create(req);
};

export const updateAggregateData = async (identifier: string, req: any): Promise<any> => {
  return LearnerProficiencyAggregateData.update(req, {
    where: { identifier },
  });
};
