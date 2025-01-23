import express from 'express';
import { setDataToRequestObject } from '../../middlewares/setDataToReqObj';
import generateAudio from '../../controllers/audioSynthesis/generateAudio/generateAudio';
import getAudioRecords from '../../controllers/audioSynthesis/getAudioRecords';

const ttsRouter = express.Router();

ttsRouter.post('/generate', setDataToRequestObject('api.tts.generate'), generateAudio);
ttsRouter.post('/list/:question_id', setDataToRequestObject('api.tts.list'), getAudioRecords);

export default ttsRouter;
