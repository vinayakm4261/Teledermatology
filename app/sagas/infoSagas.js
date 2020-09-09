import { put, call, select } from 'redux-saga/effects';
import {
  resolvePromiseAction,
  rejectPromiseAction,
} from '@adobe/redux-saga-promise';

import errorTypes from '../constants/errorTypes';
import defaultDict from '../helpers/defaultDict';
import requestAPI from '../helpers/requestAPI';

import { PATIENT_DATA_LOADED, DOCTORS_FETCHED } from '../actions/infoActions';

function* loadPatientDataSaga(action) {
  try {
    const _id = yield select((state) => state.authReducer.userData._id);

    const { response, error } = yield call(
      requestAPI,
      `/patient/loadPatientData/${_id}`,
      'GET',
    );

    if (error) {
      yield call(rejectPromiseAction, action, error);
    } else if (response) {
      yield put({
        type: PATIENT_DATA_LOADED,
        payload: {
          appointments: response.appointments,
        },
      });
      yield call(resolvePromiseAction, action, 'Data loaded');
    }
  } catch (err) {
    console.log(err);
    yield call(rejectPromiseAction, action, {
      type: errorTypes.COMMON.INTERNAL_ERROR,
    });
  }
}

function* loadDoctorDataSaga(action) {
  try {
    const _id = yield select((state) => state.authReducer.userData._id);

    const { response, error } = yield call(
      requestAPI,
      `/doctor/loadDoctorData/${_id}`,
      'GET',
    );

    if (error) {
      yield call(rejectPromiseAction, action, error);
    } else if (response) {
      yield put({
        type: PATIENT_DATA_LOADED,
        payload: {
          appointments: response.appointments,
        },
      });
      yield call(resolvePromiseAction, action, 'Data loaded');
    }
  } catch (err) {
    console.log(err);
    yield call(rejectPromiseAction, action, {
      type: errorTypes.COMMON.INTERNAL_ERROR,
    });
  }
}

function* fetchDoctorsSaga(action) {
  try {
    const queryText = action.payload;

    const { response, error } = yield call(
      requestAPI,
      '/patient/fetchDoctors',
      'POST',
      { queryText },
    );

    if (error) {
      yield call(rejectPromiseAction, action, error);
    } else {
      yield put({ type: DOCTORS_FETCHED, payload: { doctors: response } });
    }
  } catch (err) {
    console.log(err);
    yield call(rejectPromiseAction, action, {
      type: errorTypes.COMMON.INTERNAL_ERROR,
    });
  }
}

export { loadPatientDataSaga, loadDoctorDataSaga, fetchDoctorsSaga };
