/* eslint-disable no-console */
import { appConfiguration } from '../../config';
import { supportedLanguages_TTS } from '../../enums/traslationAndTTS';

const { tts_api_url } = appConfiguration;

class TTSService {
  static getInstance() {
    return new TTSService();
  }

  async generateSpeech(text: string, language: keyof typeof supportedLanguages_TTS) {
    const headers = {
      accept: 'application/json, text/plain, */*',
      'content-type': 'application/json',
    };

    if (!tts_api_url)
      return {
        data: null,
        error: 'TTS API URL not found',
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
      const response = await fetch(tts_api_url, {
        method: 'POST',
        headers: headers,
        body: body,
      });

      if (response.status === 200) {
        const data = await response.json();
        return { data, error: null };
      }

      return { data: null, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  }
}

export const ttsService = TTSService.getInstance();
