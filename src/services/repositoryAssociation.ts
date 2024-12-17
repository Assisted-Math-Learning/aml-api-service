import { RepositoryAssociation } from '../models/repositoryAssociations';

export const findRepositoryAssociations = async (data: { learnerId?: string; boardId?: string; tenantId?: string }) => {
  let whereClause: any = {};
  if (data.tenantId) {
    whereClause = {
      tenant_id: data.tenantId,
    };
  }
  if (data.boardId) {
    whereClause = {
      board_id: data.boardId,
    };
  }
  if (data.learnerId) {
    whereClause = {
      learner_id: data.learnerId,
    };
  }
  return RepositoryAssociation.findAll({ where: { ...whereClause, is_active: true }, order: [['sequence', 'asc']] });
};
