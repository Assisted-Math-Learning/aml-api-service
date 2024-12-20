import express from 'express';
import { setDataToRequestObject } from '../middlewares/setDataToReqObj';
import login from '../controllers/adminAuth/login/login';
import me from '../controllers/user/me';
import { userAuth } from '../middlewares/userAuth';

export const adminAuthRouter = express.Router();

adminAuthRouter.post('/login', setDataToRequestObject('api.admin.auth.login'), login);

adminAuthRouter.get('/me', setDataToRequestObject('api.admin.auth.me'), userAuth, me);
