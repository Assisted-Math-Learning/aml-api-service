import { Optional } from 'sequelize';
import { AudioQuestionMapping } from '../models/audioQuestionMapping';
import { redisService } from './integrations/redisService';

class AudioQuestionService {
  private readonly REDIS_CONSTANTS = {
    AUDIO_QUESTION_MAPPING_LIST_MAP_PREFIX: 'audio_question_mapping_list_map_',
  };

  private _getAudioQuestionMappingListMapKey(questionId: string) {
    return `${this.REDIS_CONSTANTS.AUDIO_QUESTION_MAPPING_LIST_MAP_PREFIX}${questionId}`;
  }

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
    let audioQuestionMappings = await redisService.getObject<AudioQuestionMapping[]>(this._getAudioQuestionMappingListMapKey(questionId));
    if (audioQuestionMappings) {
      return audioQuestionMappings;
    }
    audioQuestionMappings = await AudioQuestionMapping.findAll({
      where: { question_id: questionId },
      attributes: ['audio_id'],
      raw: true,
    });
    await redisService.setEntity(this._getAudioQuestionMappingListMapKey(questionId), audioQuestionMappings);
    return audioQuestionMappings;
  }
}

export const audioQuestionService = AudioQuestionService.getInstance();
