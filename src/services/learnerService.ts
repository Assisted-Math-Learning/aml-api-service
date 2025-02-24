import { Op } from 'sequelize';
import { Learner } from '../models/learner';
import _ from 'lodash';

class LearnerService {
  static getInstance() {
    return new LearnerService();
  }

  async getLearnerByUserName(username: string): Promise<Learner | null> {
    return Learner.findOne({
      where: {
        username,
      },
    });
  }

  async getLearnersByUserNamesAndTenantId(usernames: string[], tenantId: string) {
    return Learner.findAll({
      where: {
        username: usernames,
        tenant_id: tenantId,
      },
    });
  }

  async getLearnerByIdentifier(identifier: string): Promise<Learner | null> {
    return Learner.findOne({
      where: {
        identifier,
      },
    });
  }

  async listLearners(): Promise<Learner[]> {
    return Learner.findAll();
  }

  async updateLearner(id: number, updatedData: { board_id: string | null; class_id: string | null }) {
    await Learner.update(updatedData, {
      where: { id },
    });
  }

  async getLearnerList(req: Record<string, any>) {
    const limit: any = _.get(req, 'limit');
    const offset: any = _.get(req, 'offset');
    const searchQuery: any = _.get(req, 'search_query');

    const whereClause: any = {};

    if (searchQuery) {
      whereClause.username = { [Op.iLike]: `%${searchQuery}%` };
    }

    const { rows, count } = await Learner.findAndCountAll({
      where: whereClause,
      limit,
      offset,
    });

    return {
      learners: rows,
      meta: {
        offset,
        limit,
        total: count,
      },
    };
  }
}
export const learnerService = LearnerService.getInstance();
