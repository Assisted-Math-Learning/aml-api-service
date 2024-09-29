import { Op } from 'sequelize';
import { SkillType } from '../enums/skillType';
import { Status } from '../enums/status';
import { SkillMaster } from '../models/skill';
import { amlError } from '../types/amlError';

export async function fetchSkillIdsByName(): Promise<Map<string, { id: number; name: string; type: string }>> {
  const skills = await SkillMaster.findAll({
    attributes: ['id', 'name', 'type'],
  });

  const skillMap = new Map<string, { id: number; name: string; type: string }>();

  for (const skill of skills) {
    const skillId = skill.dataValues.id;
    const skillType = skill.dataValues.type;
    const names = skill.dataValues.name;

    if (typeof names === 'object' && names !== null) {
      Object.values(names).forEach((name) => {
        if (typeof name === 'string') {
          skillMap.set(name.toLowerCase(), { id: skillId, name, type: skillType });
        }
      });
    }
  }

  return skillMap;
}

// Get skill by ID
export const getSkillById = async (skillId: string): Promise<any> => {
  const skill = await SkillMaster.findOne({
    where: { identifier: skillId, is_active: true, status: 'live' },
    attributes: { exclude: ['id'] },
  });

  return skill?.dataValues;
};

// Modify the function to check both ID and type (l1_skill)
export const checkSkillsExistByIds = async (skillIds: number[]): Promise<boolean> => {
  const skills = await SkillMaster.findAll({
    where: {
      id: skillIds,
      type: SkillType.L1_SKILL,
    },
    attributes: ['id'],
  });
  return skills.length === skillIds.length;
};

// Update skill
export const updateSkillData = async (skillId: string, req: any): Promise<any> => {
  const existingSkill = await SkillMaster.findOne({
    where: { identifier: skillId, is_active: true, status: Status.LIVE },
    raw: true,
  });

  if (!existingSkill) {
    const code = 'SKILL_NOT_FOUND';
    throw amlError(code, 'Skill not found.', 'NOT_FOUND', 404);
  }

  const updatedData = {
    ...existingSkill,
    ...req,
  };

  await SkillMaster.update(updatedData, {
    where: { identifier: skillId },
  });

  return updatedData;
};

export const checkSkillExists = async (
  skillNameObj: { [key: string]: string }, // Multilingual names object
  skillType: SkillType, // Enum for skill type
): Promise<{ exists: boolean; skill?: any }> => {
  // Query to check if the entire JSONB `name` field matches the provided multilingual names
  const skill = await SkillMaster.findOne({
    where: {
      type: skillType, // Match type (l1_skill, l2_skill, l3_skill)
      name: { [Op.contains]: skillNameObj }, // Match the full multilingual name object
      is_active: true, // Only active skills
      status: 'live', // Only live skills
    },
    attributes: ['id', 'name', 'type'], // Select the necessary fields
  });

  // Return the result, handling both found and not found cases
  return skill ? { exists: true, skill: skill.toJSON() } : { exists: false };
};
