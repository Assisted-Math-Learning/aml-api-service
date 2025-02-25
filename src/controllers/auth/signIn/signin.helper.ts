import appConfiguration from '../../../config/config';

enum TENANT {
  TELANGANA = 'telangana',
}

export const TENANT_ID_MAPPING = {
  [TENANT.TELANGANA]: appConfiguration.TENANT_ID.TELANGANA,
};

export const BOARD_ID_MAPPING = {
  [TENANT.TELANGANA]: appConfiguration.BOARD_ID.TELANGANA,
};
