import { Op, Optional } from 'sequelize';
import { AudioMaster } from '../models/audioMaster';
import { moveFileFromS3 } from './awsService';
import { cryptFactory } from './factories/cryptFactory';
import { redisService } from './integrations/redisService';

class AudioService {
  private readonly REDIS_CONSTANTS = {
    AUDIO_RECORDS_LIST_MAP_PREFIX: 'audio_records_list_map_',
  };

  private _getAudioRecordsListMapKey(hash: string) {
    return `${this.REDIS_CONSTANTS.AUDIO_RECORDS_LIST_MAP_PREFIX}${hash}`;
  }
  static getInstance() {
    return new AudioService();
  }

  async getAudioByHash(text_hash: string) {
    return AudioMaster.findOne({
      where: { description_hash: text_hash },
      attributes: { exclude: ['id'] },
      raw: true,
    });
  }

  async getAudioById(id: string) {
    return AudioMaster.findOne({
      where: { identifier: id },
      attributes: { exclude: ['id'] },
      raw: true,
    });
  }

  async createAudioData(req: Optional<any, string>) {
    return AudioMaster.create(req);
  }

  async deleteAudioById(id: string) {
    return AudioMaster.destroy({
      where: { identifier: id },
    });
  }

  async getAudioRecordsList(ids: string[]) {
    const sortedIds = ids.sort();
    const hash = cryptFactory.md5(sortedIds.join(','));
    let audioRecords = await redisService.getObject<AudioMaster[]>(this._getAudioRecordsListMapKey(hash));
    if (audioRecords) {
      return audioRecords;
    }
    audioRecords = await AudioMaster.findAll({
      where: { identifier: { [Op.in]: ids } },
      attributes: { exclude: ['id'] },
      raw: true,
    });
    await redisService.setEntity(this._getAudioRecordsListMapKey(hash), audioRecords);
    return audioRecords;
  }

  async makeAudioPermanent(audio: any) {
    const isAudioTemp = audio.audio_path.endsWith('__temp.mp3');
    if (isAudioTemp) {
      const permanentAudioPath = audio.audio_path.replace('__temp.mp3', '.mp3');
      await moveFileFromS3(audio.audio_path, permanentAudioPath);

      await AudioMaster.update(
        {
          audio_path: permanentAudioPath,
        },
        {
          where: {
            identifier: audio.identifier,
          },
        },
      );
      audio.audio_path = permanentAudioPath;
    }
    return audio;
  }
}

export const audioService = AudioService.getInstance();
