import { Schedule } from '../jobs/job';
import { clearApiLogs } from '../jobs/clearApiLogs';
import logger from '../utils/logger';

export class CronProvider {
  private registered = false;
  constructor() {}

  static getInstance(): CronProvider {
    return new CronProvider();
  }

  register() {
    if (this.registered) {
      return;
    }
    this.scheduleJobs();
    this.registered = true;
    logger.info('Cron Jobs Registered');
  }

  private scheduleJobs() {
    Schedule('0 0 * * 7', clearApiLogs);
  }
}

export const cronProvider = CronProvider.getInstance();
