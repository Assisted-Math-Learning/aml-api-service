import cryptoJs from 'crypto-js';
import { appConfiguration } from '../../config';

class CryptFactory {
  private CRYPT_KEY: string = appConfiguration.CRYPT_KEY;
  private CRYPT_IV: any = appConfiguration.CRYPT_IV;

  public static getInstance(): CryptFactory {
    return new CryptFactory();
  }

  public md5(message: string): string {
    return cryptoJs.MD5(message).toString();
  }
}

export const cryptFactory = CryptFactory.getInstance();
