import { BoardMaster } from '../models/boardMaster';
import { classMaster } from '../models/classMaster';
import { SubSkillMaster } from '../models/subSkillMaster';
import { Status } from '../enums/status';
import { Op } from 'sequelize';
import * as uuid from 'uuid';
import _ from 'lodash';
import { SkillMaster } from '../models/skill';
import { getClassById } from './class';
import { checkSkillTaxonomyIdExists } from './skillTaxonomy';
import { amlError } from '../types/amlError';
import { checkSkillsExistByIds } from './skill';

// Helper to process insertions
const processInsertionResults = (results: any[]) => {
  const insertedDetails = results.filter((result) => result.inserted);
  const skippedDetails = results.filter((result) => !result.inserted);

  return {
    count: insertedDetails.length,
    details: {
      inserted: insertedDetails.map((result) => result.name),
      skipped: skippedDetails.map((result) => result.name),
    },
  };
};

// Helper function to dynamically insert an entity based on available language keys
const insertData = async (model: any, entity: any, nameObjectKey: string) => {
  const nameObject = _.get(entity, nameObjectKey, {});
  const uniqueKeys = Object.keys(nameObject).map((key) => `${nameObjectKey}.${key}`); // Dynamically create keys like 'name.en', 'name.fr', etc.

  let existingEntity;
  for (const uniqueKey of uniqueKeys) {
    const uniqueValue = _.get(entity, uniqueKey);
    if (uniqueValue) {
      existingEntity = await model.findOne({
        where: {
          [uniqueKey]: {
            [Op.iLike]: uniqueValue,
          },
        },
        raw: true,
      });

      if (existingEntity) break; // If any language variant exists, skip insertion
    }
  }

  if (_.isNil(existingEntity)) {
    // Insert new entity if none exists for any language variant
    await model.create({
      ...entity,
      identifier: uuid.v4(),
      status: Status.LIVE,
      is_active: true,
      created_by: 'manual',
    });

    return { inserted: true, name: nameObject.en || Object.values(nameObject)[0] }; // Use 'en' name or the first available language name
  }

  return { inserted: false, name: nameObject.en || Object.values(nameObject)[0] }; // Record already exists
};

// Generalized data insertion handler
const handleDataInsertion = async (data: any[], model: any, nameKey: string) => {
  if (_.isEmpty(data)) return { count: 0, details: [] };

  const results = await Promise.all(data.map((item) => insertData(model, item, nameKey)));

  return processInsertionResults(results);
};

// Skill Data Insertion
const handleSkillInsertion = async (skillData: any[]) => {
  return handleDataInsertion(skillData, SkillMaster, 'name');
};

// Sub-Skill Data Insertion
const handleSubSkillInsertion = async (subSkillData: any[]) => {
  return handleDataInsertion(subSkillData, SubSkillMaster, 'name');
};

// Class Data Insertion
const handleClassInsertion = async (classData: any[]) => {
  return handleDataInsertion(classData, classMaster, 'name');
};

// Board Data Insertion with validation
const handleBoardInsertion = async (boardData: any[]) => {
  if (_.isEmpty(boardData)) return { count: 0, details: [] };

  const results = await Promise.all(
    _.map(boardData, async (board) => {
      // Validate skill_taxonomy_id array
      const skillTaxonomyId = _.get(board, 'skill_taxonomy_id', []);
      if (!_.isEmpty(skillTaxonomyId)) {
        const isTaxonomyIdsExists = await checkSkillTaxonomyIdExists(skillTaxonomyId);
        if (!isTaxonomyIdsExists) {
          const code = 'SKILL_TAXONOMY_NOT_EXISTS';
          throw amlError(code, 'Taxonomy Id does not exist', 'NOT_FOUND', 404);
        }
      }

      const classIds = _.get(board, 'class_ids', []);
      if (!_.isEmpty(classIds)) {
        // Check each class_id object
        for (const classId of classIds) {
          const { identifier, l1_skill_ids } = classId;

          // Validate class id
          if (!identifier) {
            const code = 'CLASS_ID_MISSING';
            throw amlError(code, 'Class Id is missing', 'BAD_REQUEST', 400);
          }

          // Validate class existence
          const isClassIdExists = await getClassById(identifier);
          if (!isClassIdExists) {
            const code = 'CLASS_ID_NOT_EXISTS';
            throw amlError(code, 'Class Id does not exist', 'NOT_FOUND', 404);
          }

          // Validate l1_skill_ids array
          if (l1_skill_ids) {
            const isL1Exists = await checkSkillsExistByIds(l1_skill_ids); // Check for 'l1_skill' type
            if (!isL1Exists) {
              const code = 'L1_SKILL_NOT_EXISTS';
              throw amlError(code, 'One or more L1 skills do not exist or are not of type l1_skill', 'NOT_FOUND', 404);
            }
          }
        }
      }

      return insertData(BoardMaster, board, 'name');
    }),
  );

  return processInsertionResults(results);
};

// Main function to handle the entire insertion process
export const insertMasterData = async (data: any): Promise<any> => {
  const skillResult = await handleSkillInsertion(_.get(data, 'skillData', []));
  const subSkillResult = await handleSubSkillInsertion(_.get(data, 'subskillData', []));
  const classResult = await handleClassInsertion(_.get(data, 'classData', []));
  const boardResult = await handleBoardInsertion(_.get(data, 'boardData', []));

  const totalInserted = skillResult.count + classResult.count + boardResult.count + subSkillResult.count;

  return {
    totalInserted,
    details: {
      skills: skillResult.details,
      classes: classResult.details,
      boards: boardResult.details,
      subSkills: subSkillResult.details,
    },
  };
};

//create master search
export const getEntitySearch = async (req: Record<string, any>): Promise<any> => {
  const { entityType, filters = {}, limit = 100, offset = 0 } = req;

  const modelMappings: Record<string, any> = {
    skill: SkillMaster,
    subSkill: SubSkillMaster,
    class: classMaster,
    board: BoardMaster,
  };

  const model = modelMappings[entityType];

  if (!model) {
    throw new Error('Invalid entity type');
  }

  const whereClause: any = {
    status: 'live',
    is_active: true,
  };

  // Handle dynamic language filtering with case insensitivity
  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      whereClause[key] = {
        [Op.or]: value.map((termObj: any) => {
          const [lang, langValue] = Object.entries(termObj)[0];

          // Ensure langValue is a string before using it in a template literal
          return {
            [lang]: {
              [Op.iLike]: `%${String(langValue)}%`, // Type assertion to string
            },
          };
        }),
      };
    } else {
      whereClause[key] = value;
    }
  });

  const data = await model.findAll({
    limit,
    offset,
    where: whereClause,
    attributes: { exclude: ['id'] },
  });

  return data;
};
