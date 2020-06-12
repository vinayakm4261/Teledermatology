import { createPromiseAction } from '@adobe/redux-saga-promise';

export const SET_LANGUAGE = 'SET_LANGUAGE';
export const APP_LOADED = 'APP_LOADED';

export const setLanguageAction = (language) => ({
  type: SET_LANGUAGE,
  payload: {
    language,
  },
});

export const setAppLoadedAction = createPromiseAction('APP_LOADED');
