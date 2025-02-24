import { Learner } from '../../models/learner';

export class LearnerTransformer {
  transform(learner: Learner) {
    return {
      username: learner.username,
      identifier: learner.identifier,
      board_id: learner.board_id,
      tenant_id: learner.tenant_id,
      class_id: learner.class_id,
      name: learner.name,
      school_id: learner.school_id,
      section_id: learner.section_id,
    };
  }

  transformList(learners: Learner[]) {
    return learners.map((learner) => this.transform(learner));
  }
}
