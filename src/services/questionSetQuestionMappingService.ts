import { QuestionSetQuestionMapping } from '../models/questionSetQuestionMapping';
import { redisService } from './integrations/redisService';

class QuestionSetQuestionMappingService {
  private readonly REDIS_CONSTANTS = {
    QUESTION_SET_QUESTION_MAPPING_LIST_MAP_PREFIX: 'question_set_question_mapping_list_map_',
  };

  private _getQuestionSetQuestionMappingListMapKey(questionSetId: string) {
    return `${this.REDIS_CONSTANTS.QUESTION_SET_QUESTION_MAPPING_LIST_MAP_PREFIX}${questionSetId}`;
  }
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
    let questionMappings = await redisService.getObject<QuestionSetQuestionMapping[]>(this._getQuestionSetQuestionMappingListMapKey(questionSetId));
    if (questionMappings) {
      return questionMappings;
    }
    questionMappings = await QuestionSetQuestionMapping.findAll({
      where: { question_set_id: questionSetId },
      raw: true,
    });
    await redisService.setEntity(this._getQuestionSetQuestionMappingListMapKey(questionSetId), questionMappings);
    return questionMappings;
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
