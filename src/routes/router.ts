import express from 'express';
import { setDataToRequestObject } from '../middlewares/setDataToReqObj';
import getBulkUploadURL from '../controllers/bulkUpload/bulkUpload';
import uploadStatus from '../controllers/bulkUpload/uploadStatus';
import getTemplate from '../controllers/template/getTemplate';
import createTenant from '../controllers/tenantCreate/tenantCreate';
import updateTenant from '../controllers/tenantUpdate/tenantUpdate';
import readTeantById from '../controllers/tenantRead/tenantRead';
import searchTenants from '../controllers/tenantSearch/tenantSearch';
import { createMaster } from '../controllers/masterCreate/masterCreate';
import { searchMasters } from '../controllers/masterSearch/masterSearch';
import updateBoard from '../controllers/boardUpdate/boardUpdate';
import updateSkill from '../controllers/skillUpdate/skillUpdate';
import createSkillTaxonomy from '../controllers/skillTaxonomyCreate/skillTaxonomyCreate';
import searchSkillTaxonomies from '../controllers/skillTaxonomySearch/skillTaxonomySearch';
import updateClass from '../controllers/classUpdate/classUpdate';
import updateSubSkill from '../controllers/subSkillUpdate/subSkillUpdate';
import getMediaUploadURL from '../controllers/mediaUpload/mediaUpload';
import getMediaReadURL from '../controllers/mediaUpload/mediaRead';
import createQuestion from '../controllers/questionCreate/questionCreate';
import publishQuestion from '../controllers/questionPublish/publishQuestion';
import readQuestionById from '../controllers/questionRead/questionRead';
import updateQuestionById from '../controllers/questionUpdate/questionUpdate';
import deleteQuestionById from '../controllers/questionDelete/deleteQuestion';
import discardQuestionById from '../controllers/questionDiscard/discardQuestion';
import { searchQuestions } from '../controllers/questionSearch/searchQuestion';

export const router = express.Router();

router.post('/tenant/create', setDataToRequestObject('api.tenant.create'), createTenant);

router.post('/tenant/update/:tenant_id', setDataToRequestObject('api.tenant.update'), updateTenant);

router.get('/tenant/read/:tenant_id', setDataToRequestObject('api.tenant.read'), readTeantById);

router.post('/tenant/search', setDataToRequestObject('api.tenant.search'), searchTenants);

router.post('/master/create', setDataToRequestObject('api.master.create'), createMaster);

router.post('/master/search', setDataToRequestObject('api.master.search'), searchMasters);

router.post('/bulk/upload/url', setDataToRequestObject('api.bulk.url'), getBulkUploadURL);

router.get('/bulk/template/read/:fileName', setDataToRequestObject('api.bulk.template'), getTemplate);

router.get('/bulk/upload/status/:process_id', setDataToRequestObject('api.bulk.status'), uploadStatus);

router.post('/board/update/:board_id', setDataToRequestObject('api.board.update'), updateBoard);

router.post('/class/update/:class_id', setDataToRequestObject('api.class.update'), updateClass);

router.post('/skill/update/:skill_id', setDataToRequestObject('api.skill.update'), updateSkill);

router.post('/sub-skill/update/:sub_skill_id', setDataToRequestObject('api.subskill.update'), updateSubSkill);

router.post('/skill-taxonomy/create/:taxonomy_name', setDataToRequestObject('api.skillTaxonomy.create'), createSkillTaxonomy);

router.post('/skill-taxonomy/search', setDataToRequestObject('api.skillTaxonomy.search'), searchSkillTaxonomies);

router.post('/media/upload/presignedUrl', setDataToRequestObject('api.media.upload'), getMediaUploadURL);

router.post('/media/read/presignedUrl', setDataToRequestObject('api.media.read'), getMediaReadURL);

router.post('/question/create', setDataToRequestObject('api.question.create'), createQuestion);

router.post('/question/publish/:question_id', setDataToRequestObject('api.question.publish'), publishQuestion);

router.get('/question/read/:question_id', setDataToRequestObject('api.question.read'), readQuestionById);

router.post('/question/update/:question_id', setDataToRequestObject('api.question.update'), updateQuestionById);

router.post('/question/delete/:question_id', setDataToRequestObject('api.question.delete'), deleteQuestionById);

router.post('/question/discard/:question_id', setDataToRequestObject('api.question.discard'), discardQuestionById);

router.post('/question/search', setDataToRequestObject('api.question.search'), searchQuestions);
