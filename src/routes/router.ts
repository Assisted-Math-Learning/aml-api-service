import express from 'express';
import tenantRouter from './entities/tenantRouter';
import masterRouter from './entities/masterRouter';
import bulkUploadRouter from './entities/bulkUploadRouter';
import questionRouter from './entities/questionRouter';
import questionSetRouter from './entities/questionSetRouter';
import contentRouter from './entities/contentRouter';
import repositoryRouter from './entities/repositoryRouter';
import skillTaxonomyRouter from './entities/skillTaxonomyRouter';
import mediaRouter from './entities/mediaRouter';
import boardRouter from './entities/boardRouter';
import classRouter from './entities/classRouter';
import skillRouter from './entities/skillRouter';
import subSkillRouter from './entities/subSkillRouter';
import { userAuthRouter } from './userAuth.route';
import { userAuth } from '../middlewares/userAuth';
import { portalRouter } from './portal.router';
import { dataMigrations } from './dataMigration.route';
import ttsRouter from './entities/ttsRouter';
import textTranslation from '../controllers/textTranslation/textTranslation';
import { setDataToRequestObject } from '../middlewares/setDataToReqObj';
import { learnerRouter } from './entities/learnerRouter';

export const router = express.Router();

router.use('/auth', userAuthRouter);

router.use('/tenant', userAuth, tenantRouter);

router.use('/learner', userAuth, learnerRouter);

router.use('/master', userAuth, masterRouter);

router.use('/bulk', userAuth, bulkUploadRouter);

router.use('/board', userAuth, boardRouter);

router.use('/class', userAuth, classRouter);

router.use('/skill', userAuth, skillRouter);

router.use('/sub-skill', userAuth, subSkillRouter);

router.use('/skill-taxonomy', userAuth, skillTaxonomyRouter);

router.use('/media', userAuth, mediaRouter);

router.use('/question', userAuth, questionRouter);

router.use('/question-set', userAuth, questionSetRouter);

router.use('/content', userAuth, contentRouter);

router.use('/repository', userAuth, repositoryRouter);

router.use('/migration', userAuth, dataMigrations);

router.use('/tts', userAuth, ttsRouter);

router.post('/translate', setDataToRequestObject('api.translate'), userAuth, textTranslation);
/**
 * ******************************
 * ***** AML PORTAL ROUTES ******
 * ******************************
 */

router.use('/portal', portalRouter);

router.all('*', (_, res) => {
  res.status(404).json({
    message: "Endpoint doesn't exist",
  });
});
