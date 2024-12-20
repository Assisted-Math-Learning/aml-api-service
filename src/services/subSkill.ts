import { Op } from 'sequelize';
import { Status } from '../enums/status';
import { SubSkillMaster } from '../models/subSkillMaster'; // The model file
import { amlError } from '../types/amlError';
import _ from 'lodash';
import { DEFAULT_LIMIT } from '../constants/constants';
import { Sequelize } from 'sequelize-typescript';

// Update a sub-skill
export const updateSubSkillData = async (subSkillId: string, data: any): Promise<any> => {
  const existingSubSkill = await SubSkillMaster.findOne({
    where: { identifier: subSkillId, status: Status.LIVE, is_active: true },
    raw: true,
  });

  if (!existingSubSkill) {
    const code = 'SUBSKILL_NOT_FOUND';
    throw amlError(code, 'Sub-skill not found.', 'NOT_FOUND', 404);
  }

  const updatedData = {
    ...existingSubSkill,
    ...data,
  };

  await SubSkillMaster.update(updatedData, {
    where: { identifier: subSkillId },
  });

  return updatedData;
};

// Get a sub-skill by ID
export const getSubSkill = async (subSkillId: string): Promise<any> => {
  const subSkill = await SubSkillMaster.findOne({
    where: { identifier: subSkillId, is_active: true },
    attributes: { exclude: ['id'] },
  });

  return subSkill?.dataValues;
};

export const checkSubSkillsExist = async (subSkills: { name: { [key: string]: string } }[]): Promise<{ exists: boolean; foundSkills?: any[] }> => {
  const conditions = subSkills.map((subSkill) => ({
    name: { [Op.contains]: subSkill.name },
    is_active: true,
  }));

  const foundSkills = await SubSkillMaster.findAll({
    where: { [Op.or]: conditions },
    attributes: ['id', 'name'],
  });

  const foundSkillsList = foundSkills.map((skill) => skill.toJSON());

  // If the number of found skills is less than requested, some are missing
  const exists = foundSkills.length === subSkills.length;

  return { exists, foundSkills: foundSkillsList };
};

// list sub-skill
export const getSubSkillList = async (req: Record<string, any>) => {
  const limit: any = _.get(req, 'limit');
  const offset: any = _.get(req, 'offset');
  const searchQuery: any = _.get(req, 'search_query');

  let whereClause: any = {};

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
        Sequelize.literal(`
    EXISTS (
      SELECT 1 
      FROM jsonb_each_text(description) AS kv
      WHERE LOWER(kv.value) LIKE '%${searchQuery.toLowerCase()}%'
    )
  `),
      ],
    };
  }

  const finalLimit = limit || DEFAULT_LIMIT;
  const finalOffset = offset || 0;

  const { rows, count } = await SubSkillMaster.findAndCountAll({ where: whereClause, limit: finalLimit, offset: finalOffset });

  return {
    sub_skills: rows,
    meta: {
      offset: finalOffset,
      limit: finalLimit,
      total: count,
    },
  };
};
