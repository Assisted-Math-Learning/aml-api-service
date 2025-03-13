import { Tenant } from '../models/tenant';
import { Op, Optional, Sequelize } from 'sequelize';
import { UpdateTenant } from '../types/tenantModel';
import _ from 'lodash';
import { Status } from '../enums/status';
import { DEFAULT_LIMIT } from '../constants/constants';
import { redisService } from './integrations/redisService';

class TenantService {
  private readonly REDIS_CONSTANTS = {
    TENANT_ENT_KEY: 'tenant_ent',
    TENANT_LIST_MAP_PREFIX: 'tenant_list_map_',
  };

  private _getTenantEntKey(identifier: string) {
    return `${this.REDIS_CONSTANTS.TENANT_ENT_KEY}:${identifier}`;
  }

  private _getTenantListMapKey(filterHash: string) {
    return `${this.REDIS_CONSTANTS.TENANT_LIST_MAP_PREFIX}${filterHash}`;
  }

  static getInstance() {
    return new TenantService();
  }

  //create service for tenant
  async createTenantData(req: Optional<any, string> | undefined) {
    return Tenant.create(req, { raw: true });
  }

  //update single tenant
  async updateTenantData(identifier: string, req: UpdateTenant) {
    const whereClause: Record<string, any> = { identifier, is_active: true, status: Status.LIVE };
    return Tenant.update(req, { where: whereClause, returning: true });
  }

  //get tenant
  async getTenant(tenant_id: string) {
    let tenant = await redisService.getObject<Tenant>(this._getTenantEntKey(tenant_id));
    if (tenant) {
      return tenant;
    }
    tenant = await Tenant.findOne({
      where: { identifier: tenant_id, is_active: true, status: Status.LIVE },
      attributes: { exclude: ['id'] },
      raw: true,
    });

    await redisService.setEntity(this._getTenantEntKey(tenant_id), tenant);

    return tenant;
  }

  //filter tenants
  async getTenantSearch(req: Record<string, any>) {
    const limit: any = _.get(req, 'limit');
    const offset: any = _.get(req, 'offset');
    const { filters = {} } = req || {};
    const searchQuery: any = _.get(req, 'search_query');

    let whereClause: any = {};

    whereClause.status = Status.LIVE;
    whereClause.is_active = true;

    if (searchQuery) {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          Sequelize.literal(`
    EXISTS (
      SELECT 1 
      FROM jsonb_each_text(name) AS kv
      WHERE LOWER(kv.value) LIKE '%${searchQuery.toLowerCase()}%'
    )
  `),
        ],
      };
    }
    if (filters.name) {
      whereClause.name = {
        [Op.or]: filters.name.map((termObj: any) => {
          const [key, value] = Object.entries(termObj)[0];
          return {
            [key]: { [Op.iLike]: `%${String(value)}%` },
          };
        }),
      };
    }

    return Tenant.findAll({
      limit: limit || DEFAULT_LIMIT,
      offset: offset || 0,
      ...(whereClause && { where: whereClause }),
      attributes: { exclude: ['id'] },
      raw: true,
    });
  }

  //tenant Name check
  async checkTenantNameExists(tenantNames: { [key: string]: string }) {
    const conditions = Object.entries(tenantNames).map(([lang, name]) => ({
      name: { [Op.contains]: { [lang]: name } }, // Dynamic condition for each language
      is_active: true,
      status: Status.LIVE,
    }));

    const tenant = await Tenant.findOne({
      where: { [Op.or]: conditions },
      attributes: ['id', 'name'], // Fetch ID and name only
    });

    return tenant ? { exists: true, tenant: tenant.toJSON() } : { exists: false };
  }
}

export const tenantService = TenantService.getInstance();
