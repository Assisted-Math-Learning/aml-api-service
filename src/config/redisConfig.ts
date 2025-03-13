import Redis from 'ioredis';
import logger from '../utils/logger';
import appConfiguration from './config';

// ✅ Create Redis client
const redisClient = new Redis(appConfiguration.redisUrl, {
  keyPrefix: `aml_portal_${appConfiguration.applicationEnv}:`,
});

redisClient
  .on('connect', () => {
    logger.info(`[portalRouter] Redis connection successful`);
  })
  .on('error', (err: any) => {
    logger.error(`[portalRouter] Redis connection error: ${err}`);
  });

export default redisClient;
