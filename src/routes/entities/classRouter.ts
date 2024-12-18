import express from 'express';
import { setDataToRequestObject } from '../../middlewares/setDataToReqObj';
import updateClass from '../../controllers/classUpdate/classUpdate';

const classRouter = express.Router();

classRouter.post('/update/:class_id', setDataToRequestObject('api.class.update'), updateClass);

export default classRouter;
