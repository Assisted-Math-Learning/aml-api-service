import { Op, Optional } from 'sequelize';
import { Status } from '../enums/status';
import { Repository } from '../models/repository';
import _ from 'lodash';
import { DEFAULT_LIMIT } from '../constants/constants';

export const checkRepositoryNameExists = async (repositoryNames: { [key: string]: string }): Promise<{ exists: boolean; repository?: any }> => {
  // Convert repositoryNames into conditions dynamically
  const conditions = Object.entries(repositoryNames).map(([lang, name]) => ({
    name: { [Op.contains]: { [lang]: name } }, // Check for each language dynamically
    is_active: true,
    status: Status.LIVE,
  }));

  // Query the repository using the dynamically created conditions
  const repository = await Repository.findOne({
    where: { [Op.or]: conditions },
    attributes: ['id', 'name'], // Fetch only the necessary fields
  });

  // Return the result, simplifying the access of attributes
  return repository ? { exists: true, repository: repository.toJSON() } : { exists: false };
};

// Create a new repository
export const createRepositoryData = async (req: Optional<any, string> | undefined): Promise<any> => {
  const insertRepository = await Repository.create(req);
  return insertRepository;
};

// Get a single repository by identifier
export const getRepositoryById = async (id: string, additionalConditions: object = {}): Promise<any> => {
  // Combine base conditions with additional conditions
  const conditions = {
    identifier: id,
    ...additionalConditions,
  };

  const contentDetails = await Repository.findOne({
    where: conditions,
    attributes: { exclude: ['id'] },
  });

  return contentDetails?.dataValues;
};

//publish question
export const publishRepositoryById = async (id: string): Promise<any> => {
  const questionDeatils = await Repository.update({ status: Status.LIVE }, { where: { identifier: id }, returning: true });
  return { questionDeatils };
};

// Update repository by identifier
export const updateRepository = async (identifier: string, req: any): Promise<any> => {
  const whereClause: Record<string, any> = { identifier };
  whereClause.is_active = true; // Ensure only active repositories are updated
  const updateRepository = await Repository.update(req, { where: whereClause });
  return updateRepository;
};

// Delete repository (soft delete) by identifier
export const deleteRepositoryByIdentifier = async (identifier: string): Promise<any> => {
  const repositoryDetails = await Repository.update({ is_active: false }, { where: { identifier }, returning: true });
  return repositoryDetails;
};

// Discard repository (hard delete) by identifier
export const discardRepositoryByIdentifier = async (identifier: string): Promise<any> => {
  const repository = await Repository.destroy({
    where: { identifier },
  });

  return repository;
};

// Get a list of repositories with optional filters and pagination
export const getRepositoryList = async (req: Record<string, any>) => {
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

  const repositories = await Repository.findAll({ limit: limit || DEFAULT_LIMIT, offset: offset || 0, ...(whereClause && { where: whereClause }), attributes: { exclude: ['id'] } });
  return repositories;
};
