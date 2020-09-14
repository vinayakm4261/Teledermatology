import { PermissionsAndroid } from 'react-native';
import { put, call, select } from 'redux-saga/effects';
import {
  resolvePromiseAction,
  rejectPromiseAction,
} from '@adobe/redux-saga-promise';

import errorTypes from '../constants/errorTypes';
import defaultDict from '../helpers/defaultDict';
import requestAPI from '../helpers/requestAPI';

import { PATIENT_DATA_LOADED } from '../actions/infoActions';

const videoCallPermissions = async () => {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);

    if (
      granted['android.permission.RECORD_AUDIO'] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted['android.permission.CAMERA'] ===
        PermissionsAndroid.RESULTS.GRANTED
    ) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

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

function* initVideoCallSaga(action) {
  try {
    const channelName = action.payload;

    const isDoctor = yield select((state) => state.authReducer.isDoctor);

    const isAllowed = yield call(videoCallPermissions);

    if (isAllowed) {
      const { response, error } = yield call(
        requestAPI,
        '/common/agoraToken',
        'POST',
        { channelName, uid: isDoctor ? 1 : 0 },
      );

      if (error) {
        yield call(rejectPromiseAction, action, error);
      } else {
        yield call(resolvePromiseAction, action, { token: response.token });
      }
    } else {
      yield call(rejectPromiseAction, action, {
        type: errorTypes.VIDEO_CALL.PERMISSIONS_DENIED,
      });
    }
  } catch (err) {
    console.log(err);
    yield call(rejectPromiseAction, action, {
      type: errorTypes.COMMON.INTERNAL_ERROR,
    });
  }
}

export { loadPatientDataSaga, loadDoctorDataSaga, initVideoCallSaga };
