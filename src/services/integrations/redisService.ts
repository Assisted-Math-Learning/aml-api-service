import { redis } from '../../config';
import moment from 'moment';

const R_TRUE = 'TRUE';
const R_FALSE = 'FALSE';

class RedisService {
  private static _instance: RedisService | null;

  private constructor() {}

  private async _get(key: string): Promise<string | null> {
    return await redis.get(key);
  }

  private async _set(key: string, data: any): Promise<void> {
    await redis.set(key, data);
  }

  private async _remove(key: string): Promise<void> {
    await redis.del(key);
  }

  private async _batchRemove(keys: string[]): Promise<void> {
    await redis.del(keys);
  }

  private async _scan(pattern: string): Promise<string[]> {
    let cursor = 0;
    const keys: string[] = [];
    do {
      const itr = await redis.scan(cursor, 'MATCH', pattern);
      cursor = +itr[0];
      keys.push(...itr[1]);
    } while (cursor !== 0);
    return keys;
  }

  public static getInstance(): RedisService {
    if (!RedisService._instance) RedisService._instance = new RedisService();

    return RedisService._instance;
  }

  public async exists(key: string): Promise<boolean> {
    return (await redis.exists(key)) === 1;
  }

  public async setNumber(key: string, data: number): Promise<void> {
    await this._set(key, data);
  }

  public async getNumber(key: string): Promise<number | null> {
    const data = await this._get(key);
    return data ? +data : null;
  }

  public async setString(key: string, data: string): Promise<void> {
    await this._set(key, data);
  }

  public async getString(key: string): Promise<string | null> {
    return await this._get(key);
  }

  public async setBoolean(key: string, value: boolean): Promise<void> {
    await this._set(key, value ? R_TRUE : R_FALSE);
  }

  public async getBoolean(key: string): Promise<boolean | null> {
    const value = await this._get(key);
    return value === R_TRUE ? true : value === R_FALSE ? false : null;
  }

  public async setObject<T>(key: string, data: T): Promise<void> {
    await this._set(key, JSON.stringify(data));
  }

  public async getObject<T>(key: string): Promise<T | null> {
    const value = await this._get(key);
    try {
      return value ? (JSON.parse(value) as T) : null;
    } catch (err) {
      return null;
    }
  }

  public async setEntity<T>(key: string, data: T | null): Promise<void> {
    if (data) {
      await this._set(key, JSON.stringify(data));
    } else {
      await this._set(key, null);
    }
  }

  public async getEntity<T>(modelType: any, key: string): Promise<T | null> {
    let underlyingObject;

    try {
      underlyingObject = await this.getObject<{ [key: string]: any }>(key);
    } catch (e) {
      return null;
    }

    if (!underlyingObject) return null;

    const dateColumns = modelType.DATE_COLUMNS;

    for (const dateColumn of dateColumns) {
      const dateValue = underlyingObject[dateColumn];

      if (!!dateValue && typeof dateValue === 'string') {
        underlyingObject[dateColumn] = moment();
      }
    }

    const entity = new modelType();
    entity.fill(underlyingObject);
    entity.fillInvoked = false;

    entity.$isPersisted = true;

    entity.$original = {
      ...entity.$attributes,
    };

    return entity;
  }

  public async removeKey(key: string) {
    await this._remove(key);
  }

  public async removeKeyIfExists(key: string) {
    if (await this.exists(key)) {
      await this.removeKey(key);
    }
  }

  public async removeKeysWithPrefix(prefix: string) {
    let cursor = '0';
    do {
      const result = await redis.scan(cursor, 'MATCH', `${prefix}*`, 'COUNT', 100);
      cursor = result[0]; // Update cursor
      const keys = result[1];

      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== '0');
  }
}

export const redisService = RedisService.getInstance();
