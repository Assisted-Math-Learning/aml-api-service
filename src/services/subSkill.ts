import { Op } from 'sequelize';
import { Status } from '../enums/status';
import { SubSkillMaster } from '../models/subSkillMaster'; // The model file
import { amlError } from '../types/amlError';

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
