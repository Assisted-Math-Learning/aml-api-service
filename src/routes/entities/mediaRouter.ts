import express from 'express';
import { setDataToRequestObject } from '../../middlewares/setDataToReqObj';
import getMediaUploadURL from '../../controllers/media/mediaUpload';
import getMediaReadURL from '../../controllers/media/mediaRead';

const mediaRouter = express.Router();

mediaRouter.post('/upload/presigned-url', setDataToRequestObject('api.media.upload'), getMediaUploadURL);

mediaRouter.post('/read/presigned-url', setDataToRequestObject('api.media.read'), getMediaReadURL);

export default mediaRouter;
