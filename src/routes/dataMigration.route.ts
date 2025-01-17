import express from 'express';
import { setDataToRequestObject } from '../middlewares/setDataToReqObj';
import { learnerTaxonomyToColumns } from '../controllers/dataMigrations/learnerTaxonomyToColumns';
import createQuestionSetQuestionMapping from '../controllers/dataMigrations/createQuestionSetQuestionMapping';

export const dataMigrations = express.Router();

dataMigrations.post('/learner-taxonomy-to-columns', setDataToRequestObject('api.migration.learnerTaxonomyToColumns'), learnerTaxonomyToColumns);

dataMigrations.post('/question-set-question-mapping', setDataToRequestObject('api.migration.learnerTaxonomyToColumns'), createQuestionSetQuestionMapping);
