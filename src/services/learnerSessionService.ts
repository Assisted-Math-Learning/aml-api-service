import { LearnerSession } from '../models/learnerSession';

class LearnerSessionService {
  static getInstance() {
    return new LearnerSessionService();
  }

  async findLearnerSession(learnerId: string): Promise<LearnerSession | null> {
    return LearnerSession.findOne({
      where: {
        sess: { learnerId },
      },
      raw: true,
      order: [['expire', 'asc']],
    });
  }

  async destroyLearnerSession(sid: string) {
    await LearnerSession.destroy({
      where: {
        sid,
      },
    });
  }
}
export const learnerSessionService = LearnerSessionService.getInstance();
