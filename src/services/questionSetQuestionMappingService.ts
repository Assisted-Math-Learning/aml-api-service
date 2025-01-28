import { QuestionSetQuestionMapping } from '../models/questionSetQuestionMapping';

class QuestionSetQuestionMappingService {
  static getInstance() {
    return new QuestionSetQuestionMappingService();
  }

  async find(questionSetId: string, questionId: string, hideDeleted = true) {
    return QuestionSetQuestionMapping.findOne({
      where: {
        question_set_id: questionSetId,
        question_id: questionId,
      },
      paranoid: hideDeleted,
    });
  }

  async create(data: { question_set_id: string; question_id: string; sequence: number; created_by: string }) {
    const mappingExists = await this.find(data.question_set_id, data.question_id, false);
    if (mappingExists) {
      if (mappingExists.isSoftDeleted()) {
        await mappingExists.restore();
      }
      await mappingExists.update({
        sequence: data.sequence,
        updated_by: data.created_by,
      });
      return mappingExists.dataValues;
    }
    return QuestionSetQuestionMapping.create(data, { raw: true });
  }

  async update(id: number, body: any) {
    return QuestionSetQuestionMapping.update(body, { where: { id } });
  }

  async getNextSequenceNumberForQuestionSet(questionSetId: string) {
    const latestEntry = await QuestionSetQuestionMapping.findOne({
      where: { question_set_id: questionSetId },
      order: [['sequence', 'desc']],
      raw: true,
    });

    if (!latestEntry) {
      return 1;
    }
    return latestEntry.sequence + 1;
  }

  async getEntriesForQuestionIds(questionIds: string[]) {
    return QuestionSetQuestionMapping.findAll({
      where: { question_id: questionIds },
      raw: true,
    });
  }

  async getEntriesForQuestionSetId(questionSetId: string) {
    return QuestionSetQuestionMapping.findAll({
      where: { question_set_id: questionSetId },
      raw: true,
    });
  }

  async updateById(id: number, body: any) {
    return QuestionSetQuestionMapping.update(body, {
      where: { id },
    });
  }

  async destroyById(id: number) {
    return QuestionSetQuestionMapping.destroy({
      where: { id },
    });
  }
}

export const questionSetQuestionMappingService = QuestionSetQuestionMappingService.getInstance();
