import { ApiLogs } from '../models/apiLogs';

export const clearApiLogs = async () => {
  try {
    await ApiLogs.truncate();
    await ApiLogs.create({
      request_type: 'apiLogs.truncate',
      request_body: { message: 'clear_logs_success' },
    });
  } catch (error: any) {
    await ApiLogs.create({
      request_type: 'apiLogs.truncate',
      error_body: { message: error?.message },
    });
  }
};
