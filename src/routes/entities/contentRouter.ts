import express from 'express';
import { setDataToRequestObject } from '../../middlewares/setDataToReqObj';
import createContent from '../../controllers/contentCreate/contentCreate';
import contentReadById from '../../controllers/contentRead/contentRead';
import publishContent from '../../controllers/contentPublish/contentPublish';
import contentUpdate from '../../controllers/contentUpdate/contentUpdate';
import deleteContentById from '../../controllers/contentDelete/contentDelete';
import discardContentById from '../../controllers/contentDiscard/contentDiscard';
import { searchContents } from '../../controllers/contentSearch/contentSearch';
import getContentMediaReadURL from '../../controllers/contentMedia/contentMedia';

const contentRouter = express.Router();

contentRouter.post('/media/read/presigned-url', setDataToRequestObject('api.contentMedia.read'), getContentMediaReadURL);

contentRouter.post('/create', setDataToRequestObject('api.content.create'), createContent);

contentRouter.get('/read/:content_id', setDataToRequestObject('api.content.read'), contentReadById);

contentRouter.post('/publish/:content_id', setDataToRequestObject('api.content.publish'), publishContent);

contentRouter.post('/update/:content_id', setDataToRequestObject('api.content.update'), contentUpdate);

contentRouter.post('/delete/:content_id', setDataToRequestObject('api.content.delete'), deleteContentById);

contentRouter.post('/discard/:content_id', setDataToRequestObject('api.content.discard'), discardContentById);

contentRouter.post('/search', setDataToRequestObject('api.content.search'), searchContents);

export default contentRouter;
