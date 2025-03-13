import cryptoJs from 'crypto-js';

class CryptFactory {

  public static getInstance(): CryptFactory {
    return new CryptFactory();
  }

  public md5(message: string): string {
    return cryptoJs.MD5(message).toString();
  }
}

export const cryptFactory = CryptFactory.getInstance();
