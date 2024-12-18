import express from 'express';
import { setDataToRequestObject } from '../../middlewares/setDataToReqObj';
import createTenant from '../../controllers/tenantCreate/tenantCreate';
import updateTenant from '../../controllers/tenantUpdate/tenantUpdate';
import readTeantById from '../../controllers/tenantRead/tenantRead';
import searchTenants from '../../controllers/tenantSearch/tenantSearch';

const tenantRouter = express.Router();

tenantRouter.post('/create', setDataToRequestObject('api.tenant.create'), createTenant);

tenantRouter.post('/update/:tenant_id', setDataToRequestObject('api.tenant.update'), updateTenant);

tenantRouter.get('/read/:tenant_id', setDataToRequestObject('api.tenant.read'), readTeantById);

tenantRouter.post('/search', setDataToRequestObject('api.tenant.search'), searchTenants);

export default tenantRouter;
