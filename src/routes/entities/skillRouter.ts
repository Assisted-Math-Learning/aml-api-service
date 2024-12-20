import express from 'express';
import { setDataToRequestObject } from '../../middlewares/setDataToReqObj';
import updateSkill from '../../controllers/skillUpdate/skillUpdate';
import listSkills from '../../controllers/listSkills/listSkills';

const skillRouter = express.Router();

skillRouter.post('/update/:skill_id', setDataToRequestObject('api.skill.update'), updateSkill);

skillRouter.post('/list', setDataToRequestObject('api.skill.list'), listSkills);

export default skillRouter;
