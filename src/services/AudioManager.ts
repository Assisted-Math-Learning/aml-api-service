import httpStatus from 'http-status';
import { audioQuestionService } from './audioQuestionService';
import { audioService } from './audioService';
import { deleteFileFromS3 } from './awsService';
import logger from '../utils/logger';
import { amlError } from '../types/amlError';
import * as _ from 'lodash';

export class AudioManager {
  constructor(
    private apiId: string,
    private msgid: string,
    private resmsgid: string,
  ) {}

  async handleAudioMappingUpdates(questionId: string, audioIds: string[], loggedInUser: any) {
    const existingAudioIdsObj = await audioQuestionService.getAudioIdsByQuestionId(questionId);

    const existingAudioIds = existingAudioIdsObj.map(({ audio_id }) => audio_id);

    const audioIdsToDelete = _.difference(existingAudioIds, audioIds);

    const newAudioIds = _.difference(audioIds, existingAudioIds);

    await this.deleteAudioMappings(questionId, audioIdsToDelete);
    await this.updateAudioMappings(questionId, newAudioIds, loggedInUser);
  }

  private async deleteAudioMappings(questionId: string, audioIdsToDelete: string[]) {
    for (const audioId of audioIdsToDelete) {
      const audioQuestionMapping = await audioQuestionService.getAudioQuestionMapping({
        question_id: questionId,
        audio_id: audioId,
      });

      if (audioQuestionMapping) {
        await audioQuestionService.deleteAudioQuestionMappingById(audioQuestionMapping.id);
      }

      const anyQAMappingRecord = await audioQuestionService.getAudioQuestionMapping({
        audio_id: audioId,
      });

      if (!anyQAMappingRecord) {
        await this.deleteAudioRecord(audioId);
      }
    }
  }

  private async deleteAudioRecord(audioId: string) {
    const audioRecord = await audioService.getAudioById(audioId);
    if (audioRecord) {
      try {
        await deleteFileFromS3(audioRecord.audio_path);
        await audioService.deleteAudioById(audioId);
      } catch (error: any) {
        const code = 'AUDIO_DELETE_FAILED';
        logger.error({ code, apiId: this.apiId, msgid: this.msgid, resmsgid: this.resmsgid, message: error });
        throw amlError(code, error, 'INTERNAL_SERVER_ERROR', httpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  private async updateAudioMappings(questionId: string, audioIds: string[], loggedInUser: any) {
    for (const audioId of audioIds) {
      const audio = await audioService.getAudioById(audioId);
      if (!audio) {
        const code = 'AUDIO_NOT_EXISTS';
        logger.error({ code, apiId: this.apiId, msgid: this.msgid, resmsgid: this.resmsgid, message: `Missing audio` });
        throw amlError(code, 'Audio not exists', 'NOT_FOUND', 404);
      }

      try {
        const updatedAudio = await audioService.makeAudioPermanent(audio);
        await this.createAudioQuestionMapping(questionId, updatedAudio, loggedInUser);
      } catch (error: any) {
        const code = 'AUDIO_UPDATE_FAILED';
        logger.error({ code, apiId: this.apiId, msgid: this.msgid, resmsgid: this.resmsgid, message: error });
        throw amlError(code, error, 'INTERNAL_SERVER_ERROR', httpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  private async createAudioQuestionMapping(questionId: any, updatedAudio: any, loggedInUser: any) {
    await audioQuestionService.createAudioQuestionMappingData({
      question_id: questionId,
      audio_id: updatedAudio.identifier,
      created_by: loggedInUser?.identifier ?? 'manual',
      language: updatedAudio.language,
    });
  }
}
