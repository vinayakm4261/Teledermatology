import { combineReducers } from 'redux';

import authReducer from './authReducer';
import localeReducer from './localeReducer';
import infoReducer from './infoReducer';

export default combineReducers({
  authReducer,
  localeReducer,
  infoReducer,
});
