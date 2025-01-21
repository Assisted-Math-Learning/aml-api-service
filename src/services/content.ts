import { Op, Optional, Sequelize } from 'sequelize';
import { Content } from '../models/content';
import { Status } from '../enums/status';
import _ from 'lodash';
import { DEFAULT_LIMIT } from '../constants/constants';

// Get a media Content by ID
export const getContentMediaById = async (getObject: { contentId: number; mediaIds: string[] }) => {
  const whereClause: any = { identifier: getObject.contentId };
  if (getObject.mediaIds) {
    const mediaConditions = getObject.mediaIds.map((id) => ({ id }));

    whereClause.media = {
      [Op.contains]: mediaConditions,
    };
  }

  return Content.findOne({
    where: whereClause,
    attributes: ['id', 'media'],
    raw: true,
  });
};

// Create a new content
export const createContentData = async (req: Optional<any, string> | undefined) => {
  return Content.create(req);
};

// Get a single Content by ID
export const getContentById = async (id: string, additionalConditions: object = {}) => {
  // Combine base conditions with additional conditions
  const conditions = {
    identifier: id,
    ...additionalConditions,
  };

  return Content.findOne({
    where: conditions,
    attributes: { exclude: ['id'] },
    raw: true,
  });
};

// Get a multiple Contents by IDs
export const getContentByIds = async (ids: string[]): Promise<any> => {
  // Combine base conditions with additional conditions
  const conditions = {
    identifier: ids,
  };

  const contentDetails = await Content.findAll({
    where: conditions,
    attributes: { exclude: ['id'] },
  });

  return contentDetails.map((c) => c.dataValues);
};

// Publish content by id
export const publishContentById = async (id: string): Promise<any> => {
  const contentDetails = await Content.update({ status: Status.LIVE }, { where: { identifier: id }, returning: true });
  return { contentDetails };
};

// Update content by identifier
export const updateContent = async (questionIdentifier: string, updateData: any) => {
  // Update the question in the database
  return Content.update(updateData, {
    where: { identifier: questionIdentifier },
    returning: true,
  });
};

// Delete content (soft delete) by identifier
export const deleteContentByIdentifier = async (identifier: string): Promise<any> => {
  const contentDetails = await Content.update({ is_active: false }, { where: { identifier }, returning: true });
  return contentDetails;
};

// Discard content (hard delete) by identifier
export const discardContentByIdentifier = async (identifier: string): Promise<any> => {
  const content = await Content.destroy({
    where: { identifier },
  });

  return content;
};

// Get a list of contents with optional filters and pagination
export const getContentList = async (req: {
  filters: {
    is_active?: boolean;
    status?: Status;
    search_query?: string;
    repository_id?: string;
    board_id?: string;
    class_id?: string;
    l1_skill_id?: string;
    l2_skill_id?: string;
    l3_skill_id?: string;
    sub_skill_id?: string;
  };
  limit?: number;
  offset?: number;
}) => {
  const limit: number = _.get(req, 'limit', DEFAULT_LIMIT);
  const offset: number = _.get(req, 'offset', 0);
  const { filters = {} } = req || {};
  const searchQuery: string = _.get(req, 'search_query', '');

  let whereClause: any = {
    is_active: true,
  };

  if (Object.prototype.hasOwnProperty.call(filters, 'is_active')) {
    whereClause = {
      ...whereClause,
      is_active: filters.is_active,
    };
  }

  if (filters.status) {
    whereClause = {
      ...whereClause,
      status: filters.status,
    };
  }

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

  if (filters.repository_id) {
    whereClause = _.set(whereClause, ['repository', 'identifier'], filters.repository_id);
  }

  if (filters.board_id) {
    whereClause = _.set(whereClause, ['taxonomy', 'board', 'identifier'], filters.board_id);
  }

  if (filters.class_id) {
    whereClause = _.set(whereClause, ['taxonomy', 'class', 'identifier'], filters.class_id);
  }

  if (filters.l1_skill_id) {
    whereClause = _.set(whereClause, ['taxonomy', 'l1_skill', 'identifier'], filters.l1_skill_id);
  }

  if (filters.l2_skill_id) {
    whereClause = {
      ...whereClause,
      taxonomy: {
        [Op.contains]: {
          l2_skill: [{ identifier: filters.l2_skill_id }],
        },
      },
    };
  }

  if (filters.l3_skill_id) {
    whereClause = {
      ...whereClause,
      taxonomy: {
        [Op.contains]: {
          l3_skill: [{ identifier: filters.l3_skill_id }],
        },
      },
    };
  }

  const { rows, count } = await Content.findAndCountAll({
    limit,
    offset,
    where: whereClause,
    attributes: { exclude: ['id'] },
  });

  return {
    contents: rows,
    meta: {
      offset,
      limit,
      total: count,
    },
  };
};
