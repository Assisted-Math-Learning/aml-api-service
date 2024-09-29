import { Tenant } from '../models/tenant';
import { Op, Optional } from 'sequelize';
import { UpdateTenant } from '../types/tenantModel';
import _ from 'lodash';
import { Status } from '../enums/status';

//create service for tenant
export const createTenantData = async (req: Optional<any, string> | undefined): Promise<any> => {
  const insertTenant = await Tenant.create(req);
  const { dataValues } = insertTenant;
  return { dataValues };
};

//update single tenant
export const updateTenantData = async (identifier: string, req: UpdateTenant): Promise<any> => {
  const whereClause: Record<string, any> = { identifier, is_active: true, status: Status.LIVE };
  const updateTenant = await Tenant.update(req, { where: whereClause });
  return { updateTenant };
};

//get tenant
export const getTenant = async (tenant_id: string): Promise<any> => {
  const tenant = await Tenant.findOne({
    where: { identifier: tenant_id, is_active: true, status: Status.LIVE },
    attributes: { exclude: ['id'] },
  });
  return tenant?.dataValues;
};

//filter tenants
export const getTenantSearch = async (req: Record<string, any>) => {
  const limit: any = _.get(req, 'limit');
  const offset: any = _.get(req, 'offset');
  const { filters = {} } = req || {};

  const whereClause: any = {};

  whereClause.status = Status.LIVE;
  whereClause.is_active = true;

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

  const tenants = await Tenant.findAll({ limit: limit || 100, offset: offset || 0, ...(whereClause && { where: whereClause }), attributes: { exclude: ['id'] } });
  return tenants;
};

//tenant Name check
export const checkTenantNameExists = async (tenantNames: { [key: string]: string }): Promise<{ exists: boolean; tenant?: any }> => {
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
};
