import express from 'express';
import { setDataToRequestObject } from '../middlewares/setDataToReqObj';
import { learnerTaxonomyToColumns } from '../controllers/dataMigrations/learnerTaxonomyToColumns';

export const dataMigrations = express.Router();

dataMigrations.post('/learner-taxonomy-to-columns', setDataToRequestObject('api.migration.learnerTaxonomyToColumns'), learnerTaxonomyToColumns);
