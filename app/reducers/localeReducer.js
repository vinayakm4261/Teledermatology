import { SET_LANGUAGE, APP_LOADED } from '../actions/localeActions';
import { SET_LOADED, SIGN_OUT } from '../actions/authActions';

const initialState = {
  languageLoaded: false,
  language: 'en',
  appLoaded: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LANGUAGE:
      return {
        ...state,
        languageLoaded: true,
        language: action.payload.language,
      };
    case APP_LOADED:
      return {
        ...state,
        appLoaded: true,
      };
    case SIGN_OUT:
      return {
        languageLoaded: false,
        language: 'en',
        appLoaded: false,
      };
    default:
      return state;
  }
};

export default reducer;
