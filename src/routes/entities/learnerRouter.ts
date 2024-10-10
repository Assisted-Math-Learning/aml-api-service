import express from 'express';
import { learnerJourneyRouter } from './learnerJourneyRouter';
import learnerProficiencyRouter from './learnerProficiencyRouter';
import getLearnerNextStep from '../../controllers/learner/learnerNextStep/getLearnerNextStep';

export const learnerRouter = express.Router();

learnerRouter.use('/journey', learnerJourneyRouter);

learnerRouter.use('/proficiency-data', learnerProficiencyRouter);

learnerRouter.get('/next-step/:learner_id', getLearnerNextStep);
