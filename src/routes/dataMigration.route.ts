import express from 'express';
import { setDataToRequestObject } from '../middlewares/setDataToReqObj';
import { learnerTaxonomyToColumns } from '../controllers/dataMigrations/learnerTaxonomyToColumns';
import createQuestionSetQuestionMapping from '../controllers/dataMigrations/createQuestionSetQuestionMapping';
import fibTypeUpdate from '../controllers/dataMigrations/fibTypeUpdate';
import updateFibScores from '../controllers/dataMigrations/updateFibScores';

export const dataMigrations = express.Router();

dataMigrations.post('/learner-taxonomy-to-columns', setDataToRequestObject('api.migration.learnerTaxonomyToColumns'), learnerTaxonomyToColumns);

dataMigrations.post('/question-set-question-mapping', setDataToRequestObject('api.migration.learnerTaxonomyToColumns'), createQuestionSetQuestionMapping);

dataMigrations.post('/fib-type-update', fibTypeUpdate);

dataMigrations.post('/update-fib-scores', updateFibScores);
