import { Optional } from 'sequelize';
import { LearnerJourney } from '../models/learnerJourney';
import { UpdateLearnerJourney } from '../types/LearnerJournyModel';

export const createLearnerJourney = async (transaction: any, req: Optional<any, string> | undefined): Promise<any> => {
  const res = await LearnerJourney.create(req, { transaction });
  const { dataValues } = res;
  return { dataValues };
};

export const updateLearnerJourney = async (transaction: any, identifier: string, req: UpdateLearnerJourney): Promise<any> => {
  const whereClause: Record<string, any> = { identifier };
  const updatedLearnerJourney = await LearnerJourney.update(req, { where: whereClause, transaction });
  return { updatedLearnerJourney };
};

export const readLearnerJourney = async (learnerId: string): Promise<{ learnerJourney: LearnerJourney | null }> => {
  const learnerJourney = await LearnerJourney.findOne({
    where: { learner_id: learnerId },
    order: [['updated_at', 'desc']],
    attributes: { exclude: ['id'] },
  });

  return { learnerJourney };
};

export const readLearnerJourneyByLearnerIdAndQuestionSetId = async (learnerId: string, questionSetId: string): Promise<{ learnerJourney: any }> => {
  const learnerJourney = await LearnerJourney.findOne({
    where: { learner_id: learnerId, question_set_id: questionSetId },
    attributes: { exclude: ['id'] },
  });

  return { learnerJourney };
};
