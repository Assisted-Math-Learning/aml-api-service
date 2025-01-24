/* eslint-disable no-console */
import { appConfiguration } from '../../config';
import { supportedLanguages_TTS } from '../../enums/traslationAndTTS';

const { translate_api_url } = appConfiguration;

class TranslationService {
  static getInstance() {
    return new TranslationService();
  }

  async generateTranslation(text: string, sourceLanguage: keyof typeof supportedLanguages_TTS, targetLanguage: keyof typeof supportedLanguages_TTS) {
    const headers = {
      accept: 'application/json, text/plain, */*',
      'content-type': 'application/json',
    };

    if (!translate_api_url)
      return {
        data: null,
        error: 'Translation API URL not found',
      };

    const body = JSON.stringify({
      sourceLanguage: sourceLanguage,
      targetLanguage: targetLanguage,
      input: text,
      task: 'translation',
      serviceId: supportedLanguages_TTS[sourceLanguage].translationServiceId,
      track: false,
    });

    try {
      const response = await fetch(translate_api_url, {
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

export const translationService = TranslationService.getInstance();
