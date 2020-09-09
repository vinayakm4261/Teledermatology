import { takeEvery } from 'redux-saga/effects';

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
  loadPatientDataSaga,
  loadDoctorDataSaga,
  patientProfileEditSaga,
  doctorProfileEditSaga,
  fetchDoctorsSaga,
} from './infoSagas';

export default function* rootSaga() {
  yield takeEvery('SET_AUTH.TRIGGER', authLoadedSaga);
  yield takeEvery('APP_LOADED.TRIGGER', appLoadedSaga);
  yield takeEvery('LOAD_USER_DATA.TRIGGER', loadUserDataSaga);
  yield takeEvery('PHONE_LOGIN.TRIGGER', loginWithPhoneSaga);
  yield takeEvery('OTP_CONFIRM.TRIGGER', otpSaga);
  yield takeEvery('REGISTER_USER.TRIGGER', registerSaga);
  yield takeEvery('SIGN_OUT_USER.TRIGGER', signOutSaga);
  yield takeEvery('LOAD_PATIENT_DATA.TRIGGER', loadPatientDataSaga);
  yield takeEvery('LOAD_DOCTOR_DATA.TRIGGER', loadDoctorDataSaga);
  yield takeEvery('PATIENT_PROFILE_EDIT.TRIGGER', patientProfileEditSaga);
  yield takeEvery('DOCTOR_PROFILE_EDIT.TRIGGER', doctorProfileEditSaga);
  yield takeEvery('FETCH_DOCTORS.TRIGGER', fetchDoctorsSaga);
}
