import _ from 'lodash';
import { Status } from '../enums/status';
import { classMaster } from '../models/classMaster';
import { amlError } from '../types/amlError';
import { Op } from 'sequelize';
import { DEFAULT_LIMIT } from '../constants/constants';
import { Sequelize } from 'sequelize-typescript';

class ClassService {
  static getInstance() {
    return new ClassService();
  }

  // Update a single class
  async updateClassData(identifier: string, req: any) {
    const existingClass = await classMaster.findOne({
      where: { identifier, is_active: true, status: Status.LIVE },
      raw: true,
    });

    if (!existingClass) {
      const code = 'CLASS_NOT_FOUND';
      throw amlError(code, 'Class not found.', 'NOT_FOUND', 404);
    }

    const updatedData = {
      ...existingClass,
      ...req,
    };

    await classMaster.update(updatedData, {
      where: { identifier },
    });

    return updatedData;
  }

  // Get class by identifier
  async getClassById(class_id: string) {
    return classMaster.findOne({
      where: { identifier: class_id, is_active: true, status: Status.LIVE },
      attributes: { exclude: ['id'] },
      raw: true,
    });
  }

  async checkClassNameExists(classNames: { [key: string]: string }) {
    // Generate conditions for each language
    const conditions = Object.entries(classNames).map(([lang, name]) => ({
      name: { [Op.contains]: { [lang]: name } },
      is_active: true,
      status: Status.LIVE,
    }));

    // Query the classMaster model
    const classRecord = await classMaster.findOne({
      where: { [Op.or]: conditions },
      attributes: ['id', 'name'],
    });

    // Return result with simplified logic
    return classRecord ? { exists: true, class: classRecord.toJSON() } : { exists: false };
  }

  //list class
  async getClassList(req: Record<string, any>) {
    const limit: any = _.get(req, 'limit');
    const offset: any = _.get(req, 'offset');
    const searchQuery: any = _.get(req, 'search_query');

    let whereClause: any = {
      status: Status.LIVE,
    };

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

    const { rows, count } = await classMaster.findAndCountAll({ where: whereClause, limit: finalLimit, offset: finalOffset });

    return {
      classes: rows,
      meta: {
        offset: finalOffset,
        limit: finalLimit,
        total: count,
      },
    };
  }
}

export const classService = ClassService.getInstance();
