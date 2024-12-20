import express from 'express';
import { setDataToRequestObject } from '../../middlewares/setDataToReqObj';
import updateSubSkill from '../../controllers/subSkillUpdate/subSkillUpdate';
import listSubSkills from '../../controllers/listSubSkills/listSubSkills';

const subSkillRouter = express.Router();

subSkillRouter.post('/update/:sub_skill_id', setDataToRequestObject('api.subskill.update'), updateSubSkill);

subSkillRouter.post('/list', setDataToRequestObject('api.subskill.list'), listSubSkills);

export default subSkillRouter;
