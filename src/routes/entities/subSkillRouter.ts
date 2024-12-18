import express from 'express';
import { setDataToRequestObject } from '../../middlewares/setDataToReqObj';
import updateSubSkill from '../../controllers/subSkillUpdate/subSkillUpdate';

const subSkillRouter = express.Router();

subSkillRouter.post('/update/:sub_skill_id', setDataToRequestObject('api.subskill.update'), updateSubSkill);

export default subSkillRouter;
