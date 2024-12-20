// Define the IConfiguration interface
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
  applicationEnv: string;
  appVersion: string;
  whitelistedOrigins: string;
  DB: {
    port: number;
    host: string;
    password: string;
    user: string;
    name: string;
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
}
