import { Op } from 'sequelize';
import { AudioMaster } from '../models/audioMaster';
import { deleteFileFromS3 } from '../services/awsService';

export const clearTempAudioFiles = async () => {
  const tempFileRecords = await AudioMaster.findAll({
    where: {
      audio_path: { [Op.iLike]: '%__temp.mp3' },
      created_at: { [Op.lt]: new Date(Date.now() - 1000 * 60 * 60 * 24) },
    },
  });
  for (const tempFileRecord of tempFileRecords) {
    await deleteFileFromS3(tempFileRecord.audio_path);
    await AudioMaster.destroy({
      where: {
        id: tempFileRecord.id,
      },
    });
  }
};
