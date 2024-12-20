import { Op, Optional } from 'sequelize';
import { Content } from '../models/content';
import { Status } from '../enums/status';
import _ from 'lodash';
import { DEFAULT_LIMIT } from '../constants/constants';

// Get a media Content by ID
export const getContentMediaById = async (getObject: { contentId: number; mediaIds: string[] }): Promise<any> => {
  const whereClause: any = { identifier: getObject.contentId };
  if (getObject.mediaIds) {
    const mediaConditions = getObject.mediaIds.map((id) => ({ id }));

    whereClause.media = {
      [Op.contains]: mediaConditions,
    };
  }

  const mediaMetaData = await Content.findOne({
    where: whereClause,
    attributes: ['id', 'media'],
    raw: true,
  });

  return mediaMetaData;
};

// Create a new content
export const createContentData = async (req: Optional<any, string> | undefined): Promise<any> => {
  const insertContent = await Content.create(req);
  return insertContent.dataValues;
};

// Get a single Content by ID
export const getContentById = async (id: string, additionalConditions: object = {}): Promise<any> => {
  // Combine base conditions with additional conditions
  const conditions = {
    identifier: id,
    ...additionalConditions,
  };

  const contentDetails = await Content.findOne({
    where: conditions,
    attributes: { exclude: ['id'] },
  });

  return contentDetails?.dataValues;
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
export const updateContent = async (questionIdentifier: string, updatedata: any): Promise<any> => {
  // Update the question in the database
  return await Content.update(updatedata, {
    where: { identifier: questionIdentifier },
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
export const getContentList = async (req: Record<string, any>) => {
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

  const contents = await Content.findAll({ limit: limit || DEFAULT_LIMIT, offset: offset || 0, ...(whereClause && { where: whereClause }), attributes: { exclude: ['id'] } });
  return contents;
};
