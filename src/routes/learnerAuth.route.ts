import express from 'express';
import { setDataToRequestObject } from '../middlewares/setDataToReqObj';
import login from '../controllers/auth/login/login';
import { learnerAuth } from '../middlewares/learnerAuth';
import logout from '../controllers/auth/logout/logout';
import signIn from '../controllers/auth/signIn/signIn';

export const learnerAuthRouter = express.Router();

// authRouter.post('/encrypt', setDataToRequestObject('api.auth.encrypt'), learnerAuth, async (req, res) => {
//   const { text } = req.body;
//
//   const encryptedText = await bcrypt.hash(text, 10);
//   res.json({
//     originalText: text,
//     encryptedText: encryptedText,
//   });
// });

learnerAuthRouter.get('/csrf-token', setDataToRequestObject('api.learner.auth.csrf'), (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

learnerAuthRouter.post('/login', setDataToRequestObject('api.learner.auth.login'), login);

learnerAuthRouter.post('/signin', setDataToRequestObject('api.learner.auth.sigin'), signIn);

learnerAuthRouter.post('/logout', setDataToRequestObject('api.learner.auth.logout'), learnerAuth, logout);
