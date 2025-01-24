import { Request, Response } from 'express';
import { audioQuestionService } from '../../services/audioQuestionService';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { ResponseHandler } from '../../utils/responseHandler';
import logger from '../../utils/logger';
import { audioService } from '../../services/audioService';
import { getFileUrlByFilePath } from '../../services/awsService';

const getAudioRecords = async (req: Request, res: Response) => {
  const apiId = _.get(req, 'id');
  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const resmsgid = _.get(res, 'resmsgid');
  const questionId = _.get(req, 'params.question_id');

  const audioIds = await audioQuestionService.getAudioIdsByQuestionId(questionId);

  const audioRecords = (await audioService.getAudioRecordsList(audioIds.map((audio) => audio.audio_id))) ?? [];

  const mutatedAudioRecords = audioRecords.map((audioRecord) => {
    return {
      ...audioRecord,
      audio_url: getFileUrlByFilePath(audioRecord.audio_path),
    };
  });

  logger.info({ apiId, msgid, resmsgid, message: `Audio records fetched successfully` });
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: mutatedAudioRecords });
};

export default getAudioRecords;
