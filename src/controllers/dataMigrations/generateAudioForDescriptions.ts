import { Request, Response } from 'express';
import { Question } from '../../models/question';
import { Op } from 'sequelize';
import { ResponseHandler } from '../../utils/responseHandler';
import httpStatus from 'http-status';
import { createHash } from 'crypto';
import _ from 'lodash';
import { AudioMaster } from '../../models/audioMaster';
import { ttsService } from '../../services/integrations/ttsService';
import { amlError } from '../../types/amlError';
import { uploadBufferToS3 } from '../../services/awsService';
import { audioService } from '../../services/audioService';
import * as uuid from 'uuid';
import { appConfiguration } from '../../config';

const { mediaFolder } = appConfiguration;

const generateAudioForDescriptions = async (req: Request, res: Response) => {
  const questionsWithAudioDescriptions = await Question.findAll({
    where: {
      question_audio_description: {
        [Op.ne]: null,
      },
    },
  });

  let allDescriptionsWithHashes: { description: string; language: string; hash: string }[] = [];

  for (const question of questionsWithAudioDescriptions) {
    const { question_audio_description } = question;
    for (const datum of Object.entries(question_audio_description || {})) {
      const [language, description] = datum;
      if (description) {
        const hash = createHash('md5').update(`${description}-${language}`.replace(/\s+/g, '').toLowerCase()).digest('hex');
        allDescriptionsWithHashes.push({ description, language, hash });
      }
    }
  }

  allDescriptionsWithHashes = _.uniqBy(allDescriptionsWithHashes, 'description');

  const allHashes = allDescriptionsWithHashes.map((data) => data.hash);

  const existingAudios = await AudioMaster.findAll({
    where: {
      description_hash: allHashes,
    },
  });

  const existingHashes = existingAudios.map((data) => data.description_hash);

  const newHashes = _.difference(allHashes, existingHashes);
  const newDescriptions = allDescriptionsWithHashes.filter((data) => newHashes.includes(data.hash));

  for (const data of newDescriptions) {
    const { description, language, hash } = data;
    const { data: speechData, error } = await ttsService.generateSpeech(description, language as any);

    if (error) {
      const code = 'TTS_FAILED';
      throw amlError(code, error, 'INTERNAL_SERVER_ERROR', httpStatus.INTERNAL_SERVER_ERROR);
    }

    const buffer = Buffer.from(speechData.audio[0].audioContent, 'base64');
    try {
      const filePath = `${mediaFolder}/audio/${hash}.mp3`;
      await uploadBufferToS3(buffer, filePath, 'audio/mp3');

      await audioService.createAudioData({
        identifier: uuid.v4(),
        description_hash: hash,
        audio_path: filePath,
        language: language,
        created_by: 'migration-api',
      });
    } catch (synthesisError: any) {
      const code = 'AUDIO_UPLOAD_FAILED';
      throw amlError(code, synthesisError, 'INTERNAL_SERVER_ERROR', httpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { success: true, new_descriptions: newDescriptions } });
};

export default generateAudioForDescriptions;
