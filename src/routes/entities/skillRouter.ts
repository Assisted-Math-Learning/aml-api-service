import express from 'express';
import { setDataToRequestObject } from '../../middlewares/setDataToReqObj';
import updateSkill from '../../controllers/skillUpdate/skillUpdate';

const skillRouter = express.Router();

skillRouter.post('/update/:skill_id', setDataToRequestObject('api.skill.update'), updateSkill);

export default skillRouter;
