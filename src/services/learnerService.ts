import { Op } from 'sequelize';
import { Learner } from '../models/learner';
import _ from 'lodash';
import { redisService } from './integrations/redisService';
import { cryptFactory } from './factories/cryptFactory';

class LearnerService {
  private readonly REDIS_CONSTANTS = {
    LEARNER_ENT_KEY: 'learner_ent',
    LEARNER_LIST_MAP_PREFIX: 'learner_list_map_',
  };

  private _getLearnerEntKey(identifier: string) {
    return `${this.REDIS_CONSTANTS.LEARNER_ENT_KEY}:${identifier}`;
  }

  private _getLearnerListMapKey(filterHash: string) {
    return `${this.REDIS_CONSTANTS.LEARNER_LIST_MAP_PREFIX}${filterHash}`;
  }

  static getInstance() {
    return new LearnerService();
  }

  async create(data: { identifier: string; username: string; password: string; tenant_id: string; board_id: string; class_id: string; created_by: string; preferred_language: string }) {
    const learner = await Learner.create(data, { raw: true });

    const filterString1 = `username:${learner.username}`;
    const filterString2 = `username:${learner.username},tenant_id:${learner.tenant_id}`;

    const hash1 = cryptFactory.md5(filterString1);
    const hash2 = cryptFactory.md5(filterString2);

    await redisService.setEntity(this._getLearnerEntKey(learner.identifier), learner);
    await redisService.setEntity(this._getLearnerEntKey(hash1), learner);
    await redisService.setEntity(this._getLearnerEntKey(hash2), learner);

    await redisService.removeKeysWithPrefix(this.REDIS_CONSTANTS.LEARNER_LIST_MAP_PREFIX);

    return learner;
  }

  async getLearnerByUserName(username: string, raw = false) {
    const filterString = `username:${username}`;
    const hash = cryptFactory.md5(filterString);
    let learner = await redisService.getObject<Learner>(this._getLearnerEntKey(hash));
    if (learner) {
      return learner;
    }
    learner = await Learner.findOne({
      where: {
        username,
      },
      raw,
    });

    await redisService.setEntity(this._getLearnerEntKey(username), learner);

    return learner;
  }

  async getLearnerByUserNameAndTenantId(username: string, tenant_id: string) {
    const filterString = `username:${username},tenant_id:${tenant_id}`;
    const hash = cryptFactory.md5(filterString);
    let learner = await redisService.getObject<Learner>(this._getLearnerEntKey(hash));
    if (learner) {
      return learner;
    }
    learner = await Learner.findOne({
      where: {
        username,
        tenant_id,
      },
      raw: true,
    });

    await redisService.setEntity(this._getLearnerEntKey(hash), learner);

    return learner;
  }

  async getLearnersByUserNamesAndTenantId(usernames: string[], tenantId: string) {
    return Learner.findAll({
      where: {
        username: usernames,
        tenant_id: tenantId,
      },
    });
  }

  async getLearnerByIdentifier(identifier: string): Promise<Learner | null> {
    let learner = await redisService.getObject<Learner>(this._getLearnerEntKey(identifier));
    if (learner) {
      return learner;
    }
    learner = await Learner.findOne({
      where: {
        identifier,
      },
    });

    await redisService.setEntity(this._getLearnerEntKey(identifier), learner);

    return learner;
  }

  async listLearners(): Promise<Learner[]> {
    return Learner.findAll();
  }

  async updateLearner(identifier: number, updatedData: { board_id?: string; class_id?: string; preferred_language?: string }) {
    return Learner.update(updatedData, {
      where: { identifier },
      returning: true,
    });
  }

  async getLearnerList(req: Record<string, any>) {
    const limit: any = _.get(req, 'limit');
    const offset: any = _.get(req, 'offset');
    const searchQuery: any = _.get(req, 'search_query');

    const whereClause: any = {};

    if (searchQuery) {
      whereClause.username = { [Op.iLike]: `%${searchQuery}%` };
    }

    const { rows, count } = await Learner.findAndCountAll({
      where: whereClause,
      limit,
      offset,
    });

    return {
      learners: rows,
      meta: {
        offset,
        limit,
        total: count,
      },
    };
  }
}

export const learnerService = LearnerService.getInstance();
