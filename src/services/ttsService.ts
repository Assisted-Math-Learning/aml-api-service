/* eslint-disable no-console */
import { supportedLanguages_TTS } from '../enums/traslationAndTTS';

class TTSService {
  static url = 'https://admin.models.ai4bharat.org/inference/convert';

  static getInstance() {
    return new TTSService();
  }

  async generateSpeech(text: string, language: keyof typeof supportedLanguages_TTS) {
    const headers = {
      accept: 'application/json, text/plain, */*',
      'content-type': 'application/json',
    };

    const body = JSON.stringify({
      sourceLanguage: language,
      input: text,
      task: 'tts',
      serviceId: supportedLanguages_TTS[language].ttsServiceId,
      samplingRate: 8000,
      gender: 'female',
      track: false,
    });

    try {
      const response = await fetch(TTSService.url, {
        method: 'POST',
        headers: headers,
        body: body,
      });

      if (response.status === 200) {
        const data = await response.json();
        return [data, null];
      }

      return [null, null];
    } catch (error) {
      return [null, error];
    }
  }
}

export const ttsService = TTSService.getInstance();
