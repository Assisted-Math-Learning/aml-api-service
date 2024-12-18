import express from 'express';
import { setDataToRequestObject } from '../../middlewares/setDataToReqObj';
import createSkillTaxonomy from '../../controllers/skillTaxonomyCreate/skillTaxonomyCreate';
import searchSkillTaxonomies from '../../controllers/skillTaxonomySearch/skillTaxonomySearch';

const skillTaxonomyRouter = express.Router();

skillTaxonomyRouter.post('/create/:taxonomy_name', setDataToRequestObject('api.skillTaxonomy.create'), createSkillTaxonomy);

skillTaxonomyRouter.post('/search', setDataToRequestObject('api.skillTaxonomy.search'), searchSkillTaxonomies);

export default skillTaxonomyRouter;
