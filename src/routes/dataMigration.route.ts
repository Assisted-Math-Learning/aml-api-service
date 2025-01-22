import express from 'express';
import { learnerTaxonomyToColumns } from '../controllers/dataMigrations/learnerTaxonomyToColumns';
import createQuestionSetQuestionMapping from '../controllers/dataMigrations/createQuestionSetQuestionMapping';
import updateQuestionSetXId from '../controllers/dataMigrations/updateQuestionSetXId';
import standardiseMediaKeys from '../controllers/dataMigrations/standardiseMediaKeys';
import updateGrid1MetaData from '../controllers/dataMigrations/updateGrid1MetaData';

export const dataMigrations = express.Router();

dataMigrations.post('/learner-taxonomy-to-columns', learnerTaxonomyToColumns);

dataMigrations.post('/question-set-question-mapping', createQuestionSetQuestionMapping);

dataMigrations.post('/update-qs-x_id', updateQuestionSetXId);

dataMigrations.post('/media-keys-fix', standardiseMediaKeys);

dataMigrations.post('/grid-1-metadata', updateGrid1MetaData);
