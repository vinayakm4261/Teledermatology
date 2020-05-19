import React, { useEffect } from 'react';
import { I18nManager } from 'react-native';
import {
  configureFonts,
  DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import { Provider } from 'react-redux';
import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';

import Navigator from './config/routes';
import store from './config/store';

import useForceUpdate from './hooks/useForceUpdate';
import translate from './locales/translate';

/* Fonts for react-native-paper */
const fontConfig = {
  default: {
    regular: {
      fontFamily: 'NotoSans-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'NotoSans-Bold',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'NotoSans-Regular',
      fontWeight: '400',
    },
    thin: {
      fontFamily: 'NotoSans-Regular',
      fontWeight: '300',
    },
  },
};

/* react-native-paper theme */
const theme = {
  ...DefaultTheme,
  fonts: configureFonts(fontConfig),
  colors: {
    ...DefaultTheme.colors,
    primary: '#6C63FF',
    accent: '#FF7364',
  },
};

const App = () => {
  const forceUpdate = useForceUpdate();

  const translationGetters = {
    en: () => require('./locales/en.json'),
    hi: () => require('./locales/hi.json'),
    mr: () => require('./locales/mr.json'),
  };

  const setI18nConfig = () => {
    /* fallback language */
    const fallback = { languageTag: 'en', isRTL: false };

    /* setting language according to device locale */
    const { languageTag, isRTL } =
      RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
      fallback;

    translate.cache.clear();

    I18nManager.forceRTL(isRTL);

    /* getting translation from locale file */
    i18n.translations = { [languageTag]: translationGetters[languageTag]() };
    i18n.locale = languageTag;
  };

  const handleLocalizationChange = () => {
    setI18nConfig();
    forceUpdate();
  };

  useEffect(() => {
    handleLocalizationChange();
    forceUpdate();

    RNLocalize.addEventListener('change', handleLocalizationChange);

    return () => {
      RNLocalize.removeEventListener('change', handleLocalizationChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <Navigator />
      </PaperProvider>
    </Provider>
  );
};

export default App;
