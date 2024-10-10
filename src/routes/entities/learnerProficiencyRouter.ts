import express from 'express';
import { setDataToRequestObject } from '../../middlewares/setDataToReqObj';
import learnerProficiencyDataSync from '../../controllers/learnerProficiencyData/learnerProficiencyDataSync/learnerProficiencyDataSync';
import learnerProficiencyDataRead from '../../controllers/learnerProficiencyData/learnerProficiencyDataRead/learnerProficiencyDataRead';

const learnerProficiencyRouter = express.Router();

learnerProficiencyRouter.post('/sync', setDataToRequestObject('api.learner.proficiency-data.sync'), learnerProficiencyDataSync);

learnerProficiencyRouter.get('/read/:learner_id', setDataToRequestObject('api.learner.proficiency-data.read'), learnerProficiencyDataRead);

export default learnerProficiencyRouter;
