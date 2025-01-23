import { Optional } from 'sequelize';
import { AudioQuestionMapping } from '../models/audioQuestionMapping';

class AudioQuestionService {
  static getInstance() {
    return new AudioQuestionService();
  }

  async getAudioQuestionMapping(whereClause: Record<string, any>) {
    return AudioQuestionMapping.findOne({
      where: whereClause,
      raw: true,
    });
  }

  async createAudioQuestionMappingData(req: Optional<any, string>) {
    return AudioQuestionMapping.create(req);
  }

  async deleteAudioQuestionMappingById(id: number) {
    return AudioQuestionMapping.destroy({
      where: { id },
    });
  }

  async getAudioIdsByQuestionId(questionId: string) {
    return AudioQuestionMapping.findAll({
      where: { question_id: questionId },
      attributes: ['audio_id'],
    });
  }
}

export const audioQuestionService = AudioQuestionService.getInstance();
