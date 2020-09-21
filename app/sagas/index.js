import { takeEvery, takeLatest } from 'redux-saga/effects';

import {
  authLoadedSaga,
  appLoadedSaga,
  loadUserDataSaga,
  loginWithPhoneSaga,
  otpSaga,
  registerSaga,
  signOutSaga,
} from './authSagas';
import {
  setDatabaseSaga,
  initChatWatcher,
  sendMessageWatcher,
} from './chatSagas';
import { loadPatientDataSaga, loadDoctorDataSaga } from './infoSagas';

export default function* rootSaga() {
  yield takeEvery('SET_AUTH.TRIGGER', authLoadedSaga);
  yield takeEvery('APP_LOADED.TRIGGER', appLoadedSaga);
  yield takeEvery('LOAD_USER_DATA.TRIGGER', loadUserDataSaga);
  yield takeEvery('PHONE_LOGIN.TRIGGER', loginWithPhoneSaga);
  yield takeEvery('OTP_CONFIRM.TRIGGER', otpSaga);
  yield takeEvery('REGISTER_USER.TRIGGER', registerSaga);
  yield takeEvery('SET_DB.TRIGGER', setDatabaseSaga);
  yield takeEvery('INIT_CHAT.TRIGGER', initChatWatcher);
  yield takeEvery('SEND_MESSAGE.TRIGGER', sendMessageWatcher);
  yield takeEvery('SIGN_OUT_USER.TRIGGER', signOutSaga);
  yield takeEvery('LOAD_PATIENT_DATA.TRIGGER', loadPatientDataSaga);
  yield takeEvery('LOAD_DOCTOR_DATA.TRIGGER', loadDoctorDataSaga);
}
