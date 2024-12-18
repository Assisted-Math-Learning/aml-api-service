import express from 'express';
import { learnerRouter } from './entities/learnerRouter';
import { authRouter } from './auth.route';
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

export const router = express.Router();

router.use('/tenant', tenantRouter);

router.use('/master', masterRouter);

router.use('/bulk', bulkUploadRouter);

router.use('/board', boardRouter);

router.use('/class', classRouter);

router.use('/skill', skillRouter);

router.use('/sub-skill', subSkillRouter);

router.use('/skill-taxonomy', skillTaxonomyRouter);

router.use('/media', mediaRouter);

router.use('/learner', learnerRouter);

router.use('/question', questionRouter);

router.use('/question-set', questionSetRouter);

router.use('/content', contentRouter);

router.use('/repository', repositoryRouter);

router.use('/auth', authRouter);

router.all('*', (_, res) => {
  res.status(404).json({
    message: "Endpoint doesn't exist",
  });
});
