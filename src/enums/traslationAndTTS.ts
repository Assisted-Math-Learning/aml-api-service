export enum ttsServicesIds {
  dravidian = 'ai4bharat/indic-tts-dravidian--gpu-t4',
  misc = 'ai4bharat/indic-tts-misc--gpu-t4',
  indoAryan = 'ai4bharat/indic-tts-indo-aryan--gpu-t4',
}

export enum translationServicesIds {
  indic = 'ai4bharat/indictrans--gpu-t4',
}

export const supportedLanguages_TTS = {
  hi: {
    name: 'hi',
    ttsServiceId: ttsServicesIds.indoAryan,
    translationServiceId: translationServicesIds.indic,
  }, // Hindi
  mr: {
    name: 'mr',
    ttsServiceId: ttsServicesIds.indoAryan,
    translationServiceId: translationServicesIds.indic,
  }, // Marathi
  as: {
    name: 'as',
    ttsServiceId: ttsServicesIds.indoAryan,
    translationServiceId: translationServicesIds.indic,
  }, // Assamese
  pa: {
    name: 'pa',
    ttsServiceId: ttsServicesIds.indoAryan,
    translationServiceId: translationServicesIds.indic,
  }, // Punjabi
  gu: {
    name: 'gu',
    ttsServiceId: ttsServicesIds.indoAryan,
    translationServiceId: translationServicesIds.indic,
  }, // Gujarati
  or: {
    name: 'or',
    ttsServiceId: ttsServicesIds.indoAryan,
    translationServiceId: translationServicesIds.indic,
  }, // Odia
  bn: {
    name: 'bn',
    ttsServiceId: ttsServicesIds.indoAryan,
    translationServiceId: translationServicesIds.indic,
  }, // Bengali

  te: {
    name: 'te',
    ttsServiceId: ttsServicesIds.dravidian,
    translationServiceId: translationServicesIds.indic,
  }, // Telugu
  ta: {
    name: 'ta',
    ttsServiceId: ttsServicesIds.dravidian,
    translationServiceId: translationServicesIds.indic,
  }, // Tamil
  kn: {
    name: 'kn',
    ttsServiceId: ttsServicesIds.dravidian,
    translationServiceId: translationServicesIds.indic,
  }, // Kannada
  ml: {
    name: 'ml',
    ttsServiceId: ttsServicesIds.dravidian,
    translationServiceId: translationServicesIds.indic,
  }, // Malayalam

  mni: {
    name: 'mni',
    ttsServiceId: ttsServicesIds.misc,
    translationServiceId: translationServicesIds.indic,
  }, // Manipuri
  brx: {
    name: 'brx',
    ttsServiceId: ttsServicesIds.misc,
    translationServiceId: translationServicesIds.indic,
  }, // Bodo
  en: {
    name: 'en',
    ttsServiceId: ttsServicesIds.misc,
    translationServiceId: translationServicesIds.indic,
  }, // English
};
