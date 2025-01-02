import express from 'express';
import { setDataToRequestObject } from '../middlewares/setDataToReqObj';
import login from '../controllers/adminAuth/login/login';
import me from '../controllers/user/me';
import { userAuth } from '../middlewares/userAuth';

export const userAuthRouter = express.Router();

userAuthRouter.post('/login', setDataToRequestObject('api.user.auth.login'), login);

userAuthRouter.get('/me', setDataToRequestObject('api.user.auth.me'), userAuth, me);
