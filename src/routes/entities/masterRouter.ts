import express from 'express';
import { setDataToRequestObject } from '../../middlewares/setDataToReqObj';
import { createMaster } from '../../controllers/masterCreate/masterCreate';
import { searchMasters } from '../../controllers/masterSearch/masterSearch';

const masterRouter = express.Router();

masterRouter.post('/create', setDataToRequestObject('api.master.create'), createMaster);

masterRouter.post('/search', setDataToRequestObject('api.master.search'), searchMasters);

export default masterRouter;
