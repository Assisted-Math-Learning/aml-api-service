import { Optional } from 'sequelize';
import { LearnerProficiencyQuestionLevelData } from '../models/learnerProficiencyQuestionLevelData';
import { LearnerProficiencyAggregateData } from '../models/learnerProficiencyAggregateData';
import { LearnerProficiencyQuestionSetLevelData } from '../models/learnerProficiencyQuestionSetLevelData';

export const getQuestionLevelDataByLearnerIdQuestionIdAndQuestionSetId = async (learnerId: string, questionId: string, questionSetId: string): Promise<LearnerProficiencyQuestionLevelData | null> => {
  return LearnerProficiencyQuestionLevelData.findOne({
    where: { learner_id: learnerId, question_id: questionId, question_set_id: questionSetId },
    attributes: { exclude: ['id'] },
    raw: true,
  });
};

export const createLearnerProficiencyQuestionLevelData = async (transaction: any, req: Optional<any, string> | undefined): Promise<LearnerProficiencyQuestionLevelData> => {
  return LearnerProficiencyQuestionLevelData.create(req, { transaction });
};

export const updateLearnerProficiencyQuestionLevelData = async (transaction: any, identifier: string, req: any): Promise<any> => {
  const whereClause: Record<string, any> = { identifier };
  const updatedLearnerData = await LearnerProficiencyQuestionLevelData.update(req, {
    where: whereClause,
    transaction,
  });
  return { updatedLearnerData };
};

export const readLearnerAggregateData = async (learnerId: string): Promise<{ learnerAggregateData: LearnerProficiencyAggregateData[] }> => {
  const learnerAggregateData = await LearnerProficiencyAggregateData.findAll({
    where: { learner_id: learnerId },
    order: [['updated_at', 'desc']],
    attributes: { exclude: ['id'] },
    raw: true,
  });

  return { learnerAggregateData };
};

export const getRecordsForLearnerByQuestionSetId = async (learnerId: string, questionSetId: string): Promise<LearnerProficiencyQuestionLevelData[]> => {
  return LearnerProficiencyQuestionLevelData.findAll({
    where: { learner_id: learnerId, question_set_id: questionSetId },
    raw: true,
    order: [['attempts_count', 'DESC']],
  });
};

export const getQuestionLevelDataRecordsForLearner = async (learnerId: string): Promise<LearnerProficiencyQuestionLevelData[]> => {
  return LearnerProficiencyQuestionLevelData.findAll({
    where: { learner_id: learnerId },
    raw: true,
  });
};

export const getQuestionSetLevelDataByLearnerIdAndQuestionSetId = async (learnerId: string, questionSetId: string): Promise<LearnerProficiencyQuestionSetLevelData | null> => {
  return LearnerProficiencyQuestionSetLevelData.findOne({
    where: { learner_id: learnerId, question_set_id: questionSetId },
    attributes: { exclude: ['id'] },
    raw: true,
  });
};

export const createLearnerProficiencyQuestionSetLevelData = async (transaction: any, req: Optional<any, string> | undefined): Promise<LearnerProficiencyQuestionSetLevelData> => {
  return LearnerProficiencyQuestionSetLevelData.create(req, { transaction });
};

export const updateLearnerProficiencyQuestionSetLevelData = async (transaction: any, identifier: string, req: any): Promise<any> => {
  const whereClause: Record<string, any> = { identifier };
  const updatedLearnerData = await LearnerProficiencyQuestionSetLevelData.update(req, {
    where: whereClause,
    transaction,
  });
  return { updatedLearnerData };
};
