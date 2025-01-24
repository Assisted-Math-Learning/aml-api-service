import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import ttsValidationSchema from './ttsValidationSchema.json';
import { ttsService } from '../../../services/integrations/ttsService';
import { schemaValidation } from '../../../services/validationService';
import logger from '../../../utils/logger';
import { amlError } from '../../../types/amlError';
import { ResponseHandler } from '../../../utils/responseHandler';
import { getFileUrlByFilePath, uploadBufferToS3 } from '../../../services/awsService';
import { appConfiguration } from '../../../config';
import { createHash } from 'crypto';
import { audioService } from '../../../services/audioService';
import * as uuid from 'uuid';
import { User } from '../../../models/users';

const { mediaFolder } = appConfiguration;

const generateAudio = async (req: Request, res: Response) => {
  const apiId = _.get(req, 'id');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');
  const requestBody = _.get(req, 'body');
  const dataBody = _.get(req, 'body.request');
  const loggedInUser: User | undefined = (req as any).user;

  const isRequestValid = schemaValidation(requestBody, ttsValidationSchema);

  if (!isRequestValid.isValid) {
    const code = 'TTS_INVALID_INPUT';
    logger.error({ code, apiId, msgid, resmsgid, requestBody, message: isRequestValid.message });
    throw amlError(code, isRequestValid.message, 'BAD_REQUEST', httpStatus.BAD_REQUEST);
  }

  const input_string = _.get(dataBody, 'input_string');
  const target_language = _.get(dataBody, 'target_language');

  const textHash = createHash('md5').update(`${input_string}-${target_language}`.replace(/\s+/g, '').toLowerCase()).digest('hex');

  let audioRecord = await audioService.getAudioByHash(textHash);

  if (!audioRecord) {
    const { data: speechData, error } = await ttsService.generateSpeech(input_string, target_language);

    if (error) {
      const code = 'TTS_FAILED';
      logger.error({ code, apiId, msgid, resmsgid, message: error });
      throw amlError(code, error, 'INTERNAL_SERVER_ERROR', httpStatus.INTERNAL_SERVER_ERROR);
    }

    const buffer = Buffer.from(speechData.audio[0].audioContent, 'base64');
    try {
      const filePath = `${mediaFolder}/audio/${textHash}__temp.mp3`;
      await uploadBufferToS3(buffer, filePath, 'audio/mp3');

      audioRecord = (
        await audioService.createAudioData({
          identifier: uuid.v4(),
          description_hash: textHash,
          audio_path: filePath,
          language: target_language,
          created_by: loggedInUser?.identifier ?? 'manual',
        })
      ).toJSON();
    } catch (synthesisError: any) {
      const code = 'AUDIO_UPLOAD_FAILED';
      logger.error({ code, apiId, msgid, resmsgid, message: synthesisError });
      throw amlError(code, synthesisError, 'INTERNAL_SERVER_ERROR', httpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  const mutatedRecord = Object.assign(audioRecord!, { audio_url: getFileUrlByFilePath(audioRecord!.audio_path) });

  logger.info({ apiId, msgid, resmsgid, message: `Speech synthesized successfully` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: mutatedRecord });
};

export default generateAudio;
