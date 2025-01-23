/* eslint-disable no-console */
import { supportedLanguages_TTS } from '../enums/traslationAndTTS';

class TranslationService {
  static url = 'https://admin.models.ai4bharat.org/inference/translate';

  static getInstance() {
    return new TranslationService();
  }

  async generateTranslation(text: string, sourceLanguage: keyof typeof supportedLanguages_TTS, targetLanguage: keyof typeof supportedLanguages_TTS) {
    const headers = {
      accept: 'application/json, text/plain, */*',
      'content-type': 'application/json',
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
      const response = await fetch(TranslationService.url, {
        method: 'POST',
        headers: headers,
        body: body,
      });

      if (response.status === 200) {
        const data = await response.json();
        return [data, null];
      }

      return [null, null];
    } catch (error: any) {
      return [null, error];
    }
  }
}

export const translationService = TranslationService.getInstance();
