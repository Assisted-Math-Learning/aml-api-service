import boardRouter from './entities/boardRouter';
import questionSetRouter from './entities/questionSetRouter';
import { learnerAuthRouter } from './learnerAuth.route';
import { learnerRouter } from './entities/learnerRouter';
import express from 'express';
import session from 'express-session';
import { appConfiguration } from '../config';
import pg from 'pg';
import ConnectPgSimple from 'connect-pg-simple';
import csrf from 'csurf';
import { learnerAuth } from '../middlewares/learnerAuth';
import ttsRouter from './entities/ttsRouter';
import classRouter from './entities/classRouter';

export const portalRouter = express.Router();

// PostgreSQL connection
const pgPool = new pg.Pool({
  user: process.env.AML_SERVICE_DB_USER,
  host: process.env.AML_SERVICE_DB_HOST,
  database: process.env.AML_SERVICE_DB_NAME,
  password: process.env.AML_SERVICE_DB_PASS,
  port: 5432,
});
const PgSession = ConnectPgSimple(session);

portalRouter.use(
  session({
    store: new PgSession({
      pool: pgPool, // Connection pool
      tableName: 'learner_sessions', // Using a specific table for session storage
    }),
    secret: appConfiguration.appSecret, // Use a strong secret in production
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: 'strict',
      // secure: process.env.AML_SERVICE_APPLICATION_ENV === 'production',
      secure: false, // TODO: needs to be addressed ASAP
      maxAge: 1000 * 60 * 60 * 24, // 24 hrs
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
