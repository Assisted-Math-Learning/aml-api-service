import express from 'express';
import { setDataToRequestObject } from '../../middlewares/setDataToReqObj';
import learnerJourneyRead from '../../controllers/learnerJourneyData/learnerJourneyRead/learnerJourneyRead';
import { learnerAuth } from '../../middlewares/learnerAuth';

export const learnerJourneyRouter = express.Router();

// learnerJourneyRouter.post('/create', setDataToRequestObject('api.learner.journey.create'), learnerJourneyCreate);

// learnerJourneyRouter.put('/update', setDataToRequestObject('api.learner.journey.update'), learnerJourneyUpdate);

learnerJourneyRouter.get('/read/:learner_id', setDataToRequestObject('api.learner.journey.read'), learnerAuth, learnerJourneyRead);
