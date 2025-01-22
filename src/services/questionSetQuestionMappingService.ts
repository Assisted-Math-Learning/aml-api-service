import { QuestionSetQuestionMapping } from '../models/questionSetQuestionMapping';

class QuestionSetQuestionMappingService {
  static getInstance() {
    return new QuestionSetQuestionMappingService();
  }

  async find(questionSetId: string, questionId: string) {
    return QuestionSetQuestionMapping.findOne({
      where: {
        question_set_id: questionSetId,
        question_id: questionId,
      },
    });
  }

  async create(data: { question_set_id: string; question_id: string; sequence: number; created_by: string }) {
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
