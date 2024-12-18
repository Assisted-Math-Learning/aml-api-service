import express from 'express';
import { setDataToRequestObject } from '../../middlewares/setDataToReqObj';
import getBulkUploadURL from '../../controllers/bulkUpload/bulkUpload';
import getTemplate from '../../controllers/template/getTemplate';
import uploadStatus from '../../controllers/bulkUpload/uploadStatus';

const bulkUploadRouter = express.Router();

bulkUploadRouter.post('/upload/url', setDataToRequestObject('api.bulk.url'), getBulkUploadURL);

bulkUploadRouter.get('/template/read/:fileName', setDataToRequestObject('api.bulk.template'), getTemplate);

bulkUploadRouter.get('/upload/status/:process_id', setDataToRequestObject('api.bulk.status'), uploadStatus);

export default bulkUploadRouter;
