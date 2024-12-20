import _ from 'lodash';
import { SkillTaxonomy } from '../models/skillTaxonomy';
import { Op } from 'sequelize';
import { Status } from '../enums/status';
import * as uuid from 'uuid';
import { SkillType } from '../enums/skillType';
import { DEFAULT_LIMIT } from '../constants/constants';

// Create skill taxonomy service
export const createSkillTaxonomyData = async (req: { [key: string]: any }[]): Promise<any> => {
  const createdSkillTaxonomies = await SkillTaxonomy.bulkCreate(req, { returning: true });
  // Return dataValues of created records
  return createdSkillTaxonomies.map(({ dataValues }) => dataValues);
};

// Get skill taxonomy by id
export const getSkillTaxonomyId = async (skill_taxonomy_id: number): Promise<any> => {
  return SkillTaxonomy.findOne({
    where: { id: skill_taxonomy_id, status: Status.LIVE, is_active: true },
    raw: true,
  });
};

// Function to validate skill_taxonomy_id
export const checkSkillTaxonomyIdExists = async (skillTaxonomyId: string | null) => {
  if (!skillTaxonomyId) return false; // Return false if the ID is null

  const skillTaxonomy = await SkillTaxonomy.findOne({
    where: { taxonomy_id: skillTaxonomyId },
    raw: true,
  });

  // Return true if the skill taxonomy ID exists, else return false
  return !!skillTaxonomy;
};

// Function to generate unique taxonomy_id
const generateUniqueTaxonomyId = (taxonomy_name: string): string => {
  return taxonomy_name.toLowerCase().replace(/\s+/g, '');
};

// Function to check if a taxonomy name already exists
export const checkTaxonomyNameExists = async (taxonomy_name: string): Promise<boolean> => {
  const existingTaxonomy = await SkillTaxonomy.findOne({
    where: {
      taxonomy_name: {
        [Op.iLike]: taxonomy_name,
      },
      status: Status.LIVE,
      is_active: true,
    },
    attributes: ['id'],
    raw: true,
  });

  // Return true if taxonomy exists, otherwise false
  return !!existingTaxonomy;
};

// Helper function to get skill ID from multilingual input
const getSkillId = (skill: any, skillMap: Map<string, { id: number; name: string; type: string }>, expectedType: string): number | undefined => {
  for (const lang in skill) {
    const name = skill[lang];
    const skillEntry = skillMap.get(name.toLowerCase());

    if (skillEntry && skillEntry.type === expectedType) {
      return skillEntry.id;
    }
  }
  return undefined;
};

// Function to process L3 skills
const processL3Skills = async (children: any[], skillMap: Map<string, { id: number; name: string; type: string }>) => {
  return await Promise.all(
    children.map((subchild: any) => {
      const l3SkillId = getSkillId(subchild.l3_skill, skillMap, SkillType.L3_SKILL);
      if (!l3SkillId) throw new Error(`L3 skill not found or mismatched type::${JSON.stringify(subchild.l3_skill)}`);

      return { ...subchild, l3_id: l3SkillId };
    }),
  );
};

// Function to process L2 skills
const processL2Skills = async (children: any[], skillMap: Map<string, { id: number; name: string; type: string }>) => {
  return await Promise.all(
    children.map(async (child: any) => {
      const l2SkillId = getSkillId(child.l2_skill, skillMap, SkillType.L2_SKILL);
      if (!l2SkillId) throw new Error(`L2 skill not found or mismatched type:${JSON.stringify(child.l2_skill)}`);

      const childrenWithL3Ids = _.get(child, 'children') ? await processL3Skills(_.get(child, 'children', []), skillMap) : [];

      return { ...child, l2_id: l2SkillId, children: childrenWithL3Ids };
    }),
  );
};

// Main function to process L1 skills and taxonomy
export const processSkillTaxonomy = async (dataBody: any[], taxonomy_name: string, skillMap: Map<string, { id: number; name: string; type: string }>): Promise<any[]> => {
  return await Promise.all(
    dataBody.map(async (taxonomy: any) => {
      const l1SkillId = getSkillId(taxonomy.l1_skill, skillMap, SkillType.L1_SKILL);
      if (!l1SkillId) throw new Error(`L1 skill not found or mismatched type:${JSON.stringify(taxonomy.l1_skill)}`);

      const childrenWithL2Ids = _.get(taxonomy, 'children') ? await processL2Skills(_.get(taxonomy, 'children', []), skillMap) : [];
      const taxonomy_id = generateUniqueTaxonomyId(taxonomy_name);

      return {
        ...taxonomy,
        identifier: uuid.v4(),
        taxonomy_id: taxonomy_id,
        taxonomy_name: taxonomy_name,
        status: Status.LIVE,
        created_by: 'system',
        is_active: true,
        l1_id: l1SkillId,
        children: childrenWithL2Ids,
      };
    }),
  );
};

//filter taxonomy
export const getSkillTaxonomySearch = async (req: Record<string, any>, order?: any) => {
  const limit: any = _.get(req, 'limit');
  const offset: any = _.get(req, 'offset');
  const { filters = {} } = req || {};

  const whereClause: any = {};

  whereClause.status = Status.LIVE;
  whereClause.is_active = true;

  if (filters.taxonomy_id) {
    whereClause.taxonomy_id = {
      [Op.or]: filters.taxonomy_id.map((id: string) => ({
        [Op.iLike]: `%${id}%`, // Partial matching for each id
      })),
    };
  }

  if (filters.l1_skill) {
    whereClause.l1_skill = {
      [Op.or]: filters.l1_skill.map((termObj: any) => {
        const [key, value] = Object.entries(termObj)[0];
        return {
          [key]: { [Op.iLike]: `%${String(value)}%` },
        };
      }),
    };
  }

  if (filters.l2_skill) {
    whereClause[Op.or] = filters.l2_skill.map((termObj: any) => {
      const [key, value] = Object.entries(termObj)[0];
      return {
        children: {
          [Op.contains]: [
            {
              l2_skill: {
                [key]: value,
              },
            },
          ],
        },
      };
    });
  }

  if (filters.l3_skill) {
    whereClause[Op.or] = filters.l3_skill.map((termObj: any) => {
      const [key, value] = Object.entries(termObj)[0];

      return {
        children: {
          [Op.contains]: [
            {
              children: [
                {
                  l3_skill: {
                    [key]: value,
                  },
                },
              ],
            },
          ],
        },
      };
    });
  }

  const options = {
    limit: limit || DEFAULT_LIMIT,
    offset: offset || 0,
    where: whereClause,
    attributes: { exclude: ['id'] },
  };

  if (order) {
    _.set(options, 'order', order);
  }

  return SkillTaxonomy.findAll(options);
};
