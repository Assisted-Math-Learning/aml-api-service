import { get, isEqual } from 'lodash';
import { IConfiguration } from './interfaces';
import { AppEnv } from '../enums/appEnv';

const envVars = process.env;

const appConfiguration: IConfiguration = {
  log: {
    day: get(envVars, 'LOG_FILE_DAY', '14d'),
    isEnable: isEqual(get(envVars, 'LOG_FILE_ENABLE', 'true'), 'true'),
    name: get(envVars, 'LOG_FILE_NAME', 'AML-log'),
    size: get(envVars, 'LOG_FILE_SIZE', '20m'),
    zippedArchive: isEqual(get(envVars, 'LOG_FILE_ZIP_ARCHIVE', 'false'), 'true'),
  },
  envPort: get(envVars, 'AML_SERVICE_APPLICATION_PORT', 4000) as number,
  appSecret: get(envVars, 'AML_SERVICE_APP_SECRET', 'something'),
  applicationEnv: get(envVars, 'AML_SERVICE_APPLICATION_ENV', AppEnv.DEVELOPMENT),
  appVersion: get(envVars, 'AML_SERVICE_APP_VERSION', '1.0'),
  whitelistedOrigins: get(envVars, 'AML_SERVICE_WHITELISTED_ORIGINS', ''),
  DB: {
    host: get(envVars, 'AML_SERVICE_DB_HOST', 'localhost'),
    port: get(envVars, 'AML_SERVICE_DB_PORT', 5432) as number,
    password: get(envVars, 'AML_SERVICE_DB_PASS', 'postgres'),
    name: get(envVars, 'AML_SERVICE_DB_NAME', 'postgres'),
    user: get(envVars, 'AML_SERVICE_DB_USER', 'postgres'),
  },
  bucketName: get(envVars, 'BUCKET_NAME', 'dummyBucket'),
  presignedUrlExpiry: get(envVars, 'AWS_EXPIRY_TIME', 1800) as number,
  bulkUploadFolder: get(envVars, 'UPLOAD_FOLDER', 'upload'),
  templateFolder: get(envVars, 'TEMPLATE_FOLDER', 'template'),
  mediaFolder: get(envVars, 'MEDIA_FOLDER', 'media'),
  aws: {
    secretKey: get(envVars, 'AML_AWS_SECRET_KEY', ''),
    accessKey: get(envVars, 'AML_AWS_ACCESS_KEY', ''),
    bucketRegion: get(envVars, 'AML_AWS_BUCKET_REGION', 'us-east-1'),
    bucketOutput: get(envVars, 'AML_AWS_BUCKET_OUTPUT', 'table'),
  },
  aml_jwt_secret_key: get(envVars, 'AML_JWT_SECRET_KEY', 'your-secret-key'),
};

export default appConfiguration;
