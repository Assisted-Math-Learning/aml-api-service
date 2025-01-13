import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import { NOT_FOUND } from 'http-status';
import { appConfiguration } from './config';
import logger from './utils/logger';
import { router } from './routes/router';
import { amlErrorHandler } from './middlewares/errorhandler';
import cookieParser from 'cookie-parser';
import path from 'path';
import RateLimit from 'express-rate-limit';
import { cronProvider } from './providers/cron.provider';
import { AppEnv } from './enums/appEnv';

const { envPort, applicationEnv } = appConfiguration;

const app: Application = express();

let server: ReturnType<typeof app.listen>;

// Define the error handler
const unexpectedErrorHandler = (error: Error): void => {
  logger.error('An unexpected error occurred', { message: error.message, stack: error.stack });
  exitHandler();
};

// Graceful server shutdown
const exitHandler = (): void => {
  if (server) {
    // Check if server is defined
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

const getSubdomainByEnv = (): string => {
  if (applicationEnv === AppEnv.DEVELOPMENT) {
    return 'dev.';
  }
  return '';
};

const initializeServer = (): void => {
  try {
    // Middleware for parsing JSON request body
    app.use(express.json({ limit: '5mb' }));

    // Middleware for parsing urlencoded request body
    app.use(express.urlencoded({ extended: true }));

    // Middleware to enable CORS
    app.use(
      cors({
        origin: (origin, callback) => {
          // NOTE: hardcoded for now, will be changed to env variable later
          const devOrigins = [
            'http://localhost:5173', // For local
            'http://localhost:5174', // For local
          ];

          const allOrigins = [
            ...(applicationEnv === AppEnv.DEVELOPMENT ? devOrigins : []),
            `https://${getSubdomainByEnv()}portal.theaml.ai`, // For FE
            `https://dashboard.${getSubdomainByEnv()}portal.theaml.ai`, // For dashboard BE
          ];
          if (!origin || allOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
        credentials: true,
      }),
    );

    // Enable CORS preflight for all routes
    app.options(/.*/, cors());

    // Use cookie-parser middleware
    app.use(cookieParser());

    const limiter = RateLimit({
      windowMs: 60 * 1000, // 1 minute
      limit: 100, // max 100 requests per windowMs
    });
    app.use(limiter);

    // static route
    app.use(express.static(path.join(__dirname, 'dist')));

    // Router
    app.use('/api/v1', router);

    app.use(amlErrorHandler);

    app.get(/.*/, function (req, res) {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });

    // 404 handler for unknown API requests
    app.use((req: Request, res: Response, next: NextFunction) => {
      next({ statusCode: NOT_FOUND, message: 'Not found' });
    });

    // Start the server
    app.listen(envPort, () => {
      logger.info(`Listening on port. ${envPort}`);
    });

    // Register cron jobs
    cronProvider.register();

    // Handle uncaught exceptions and unhandled rejections
    process.on('uncaughtException', unexpectedErrorHandler);
    process.on('unhandledRejection', unexpectedErrorHandler);
  } catch (error: any) {
    logger.error('Failed to start server', { message: error.message });
    process.exit(1);
  }
};

// Start the server
void initializeServer();

// Export for testing
export default app;
