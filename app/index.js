import React, { useEffect } from 'react';
import {
  configureFonts,
  DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import * as RNLocalize from 'react-native-localize';

import Navigator from './screens/Navigator';
import store from './config/store';
import initalizeTranslations from './locales/initialize';

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
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'NotoSans-Regular',
      fontWeight: 'normal',
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
    primaryDark: '#4B45B2',
    accent: '#FF7364',
    greyDark: '#696969',
    grey: '#AAAAAA',
    greyLight: '#B2B2B2',
    greyPrimary: '#3F3D56',
    status: {
      PENDING: '#4B45B2',
      ACCEPTED: '#00B090',
      REJECTED: '#B00020',
    },
    background: '#FAFAFA',
  },
};

const App = () => {
  useEffect(() => {
    RNLocalize.addEventListener('change', initalizeTranslations);

    return () => {
      RNLocalize.removeEventListener('change', initalizeTranslations);
    };
  }, []);

  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={theme}>
        <Navigator />
      </PaperProvider>
    </ReduxProvider>
  );
};

export default App;
