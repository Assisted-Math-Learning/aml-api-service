import boardRouter from './entities/boardRouter';
import questionSetRouter from './entities/questionSetRouter';
import { learnerAuthRouter } from './learnerAuth.route';
import { learnerRouter } from './entities/learnerRouter';
import express from 'express';
import session from 'express-session';
import { appConfiguration } from '../config';
import csrf from 'csurf';
import { learnerAuth } from '../middlewares/learnerAuth';
import ttsRouter from './entities/ttsRouter';
import classRouter from './entities/classRouter';

export const portalRouter = express.Router();

// ✅ Initialize Redis Session Store
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';
import logger from '../utils/logger';

// ✅ Create Redis client
const redisClient = createClient({ url: appConfiguration.redisUrl });
redisClient.connect().catch((err) => {
  logger.error(`[portalRouter] Redis connection error: ${err}`);
});

// ✅ Create Redis store
const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'aml_portal:',
});

portalRouter.use(
  session({
    store: redisStore,
    secret: appConfiguration.appSecret, // Use a strong secret in production
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: 'strict',
      // secure: process.env.AML_SERVICE_APPLICATION_ENV === 'production',
      secure: false, // TODO: needs to be addressed ASAP
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      httpOnly: false, // Mitigate XSS attacks
    },
  }),
);

const csrfProtection = csrf({ cookie: true });
portalRouter.use(csrfProtection);

portalRouter.use('/board', learnerAuth, boardRouter);

portalRouter.use('/class', classRouter);

portalRouter.use('/question-set', learnerAuth, questionSetRouter);

portalRouter.use('/auth', learnerAuthRouter);

portalRouter.use('/learner', learnerAuth, learnerRouter);

portalRouter.use('/tts', learnerAuth, ttsRouter);
