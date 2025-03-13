import { Optional } from 'sequelize';
import { LearnerJourney } from '../models/learnerJourney';
import { UpdateLearnerJourney } from '../types/LearnerJournyModel';
import { redisService } from './integrations/redisService';
import { cryptFactory } from './factories/cryptFactory';

const REDIS_CONSTANTS = {
  LEARNER_JOURNEY_ENT_KEY: 'learner_journey_ent',
  LEARNER_JOURNEY_LIST_MAP_PREFIX: 'learner_journey_list_map_',
};

const _getLearnerJourneyEntKey = (identifier: string) => {
  return `${REDIS_CONSTANTS.LEARNER_JOURNEY_ENT_KEY}:${identifier}`;
};

export const createLearnerJourney = async (transaction: any, req: Optional<any, string> | undefined): Promise<any> => {
  const learnerJourney = await LearnerJourney.create(req, { transaction, raw: true });

  await redisService.setEntity(_getLearnerJourneyEntKey(learnerJourney.learner_id), learnerJourney);

  return learnerJourney;
};

export const updateLearnerJourney = async (transaction: any, identifier: string, req: UpdateLearnerJourney): Promise<any> => {
  const whereClause: Record<string, any> = { identifier };
  const [, affectedRows] = await LearnerJourney.update(req, { where: whereClause, transaction, returning: true });
  const updatedLearnerJourney = affectedRows[0];
  const filterString = `learner_id:${updatedLearnerJourney.learner_id},question_set_id:${updatedLearnerJourney.question_set_id}`;
  const hash = cryptFactory.md5(filterString);

  // Set the learner journey in redis for all combinations of filters
  await redisService.setEntity(_getLearnerJourneyEntKey(updatedLearnerJourney.learner_id), updatedLearnerJourney);
  await redisService.setEntity(_getLearnerJourneyEntKey(hash), updatedLearnerJourney);
  return { updatedLearnerJourney };
};

export const readLearnerJourney = async (learnerId: string): Promise<{ learnerJourney: LearnerJourney | null }> => {
  let learnerJourney = await redisService.getObject<LearnerJourney>(_getLearnerJourneyEntKey(learnerId));
  if (learnerJourney) {
    return { learnerJourney };
  }
  learnerJourney = await LearnerJourney.findOne({
    where: { learner_id: learnerId },
    order: [['updated_at', 'desc']],
    attributes: { exclude: ['id'] },
    raw: true,
  });

  await redisService.setEntity(_getLearnerJourneyEntKey(learnerId), learnerJourney);

  return { learnerJourney };
};

export const readLearnerJourneyByLearnerIdAndQuestionSetId = async (learnerId: string, questionSetId: string): Promise<{ learnerJourney: any }> => {
  const filterString = `learner_id:${learnerId},question_set_id:${questionSetId}`;
  const hash = cryptFactory.md5(filterString);
  let learnerJourney = await redisService.getObject<LearnerJourney>(_getLearnerJourneyEntKey(hash));
  if (learnerJourney) {
    return { learnerJourney };
  }
  learnerJourney = await LearnerJourney.findOne({
    where: { learner_id: learnerId, question_set_id: questionSetId },
    attributes: { exclude: ['id'] },
    order: [['attempt_number', 'desc']],
    raw: true,
  });

  await redisService.setEntity(_getLearnerJourneyEntKey(hash), learnerJourney);

  return { learnerJourney };
};
