// Define the IConfiguration interface
import { AppEnv } from '../../enums/appEnv';

export interface IConfiguration {
  log: {
    day: string;
    isEnable: boolean;
    name: string;
    size: string;
    zippedArchive: boolean;
  };
  envPort: number;
  appSecret: string;
  applicationEnv: AppEnv;
  appVersion: string;
  whitelistedOrigins: string;
  DB: {
    port: number;
    host: string;
    password: string;
    user: string;
    name: string;
    minConnections: number;
    maxConnections: number;
  };
  bucketName: string;
  presignedUrlExpiry: number;
  bulkUploadFolder: string;
  templateFolder: string;
  mediaFolder: string;
  aws: {
    secretKey: string;
    accessKey: string;
    bucketRegion: string;
    bucketOutput: string;
  };
  aml_jwt_secret_key: string;
  tts_api_url: string;
  translate_api_url: string;
  TENANT_ID: any;
  BOARD_ID: any;
  redisUrl: string;
}
