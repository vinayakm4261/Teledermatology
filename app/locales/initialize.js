import { I18nManager } from 'react-native';
import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import translate from './translate';

const translationGetters = {
  en: () => require('./en.json'),
  hi: () => require('./hi.json'),
  mr: () => require('./mr.json'),
};

const fallbackLanguage = { languageTag: 'en', isRTL: false };

const initalizeTranslations = async () => {
  const { languageTag, isRTL } =
    RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
    fallbackLanguage;

  translate.cache.clear();

  I18nManager.forceRTL(isRTL);

  const translations = await translationGetters[languageTag]();
  i18n.translations = { [languageTag]: translations };
  i18n.locale = languageTag;

  return languageTag;
};

export default initalizeTranslations;
