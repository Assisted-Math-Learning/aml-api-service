import { Learner } from '../models/learner';

export const getLearnerByUserName = async (username: string): Promise<Learner | null> => {
  return Learner.findOne({
    where: {
      username,
    },
  });
};

export const getLearnerByIdentifier = async (identifier: string): Promise<Learner | null> => {
  return Learner.findOne({
    where: {
      identifier,
    },
  });
};

export const listLearners = async (): Promise<Learner[]> => {
  return Learner.findAll();
};

export const updateLearner = async (id: number, updatedData: { board_id: string | null; class_id: string | null }) => {
  await Learner.update(updatedData, {
    where: { id },
  });
};
