import { put, call, select } from 'redux-saga/effects';
import {
  resolvePromiseAction,
  rejectPromiseAction,
} from '@adobe/redux-saga-promise';

import errorTypes from '../constants/errorTypes';
import defaultDict from '../helpers/defaultDict';
import requestAPI from '../helpers/requestAPI';

import { PATIENT_DATA_LOADED } from '../actions/infoActions';

const loadPatientDataSaga = function* (action) {
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
};

const loadDoctorDataSaga = function* (action) {
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
};

export { loadPatientDataSaga, loadDoctorDataSaga };
