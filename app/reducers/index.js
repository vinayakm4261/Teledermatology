import { combineReducers } from 'redux';

import authReducer from './authReducer';
import localeReducer from './localeReducer';

export default combineReducers({
  authReducer,
  localeReducer,
});
