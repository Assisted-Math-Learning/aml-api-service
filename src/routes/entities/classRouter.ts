import express from 'express';
import { setDataToRequestObject } from '../../middlewares/setDataToReqObj';
import updateClass from '../../controllers/classUpdate/classUpdate';
import listClass from '../../controllers/listClasses/listClasses';

const classRouter = express.Router();

classRouter.post('/update/:class_id', setDataToRequestObject('api.class.update'), updateClass);

classRouter.post('/list', setDataToRequestObject('api.class.list'), listClass);

export default classRouter;
