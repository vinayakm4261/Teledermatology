import { combineReducers } from 'redux';

import authReducer from './authReducer';
import localeReducer from './localeReducer';
import chatReducer from './chatReducer';
import infoReducer from './infoReducer';

export default combineReducers({
  authReducer,
  localeReducer,
  chatReducer,
  infoReducer,
});
