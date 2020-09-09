import { put, call, select } from 'redux-saga/effects';
import {
  resolvePromiseAction,
  rejectPromiseAction,
} from '@adobe/redux-saga-promise';
import RNFetchBlob from 'rn-fetch-blob';

import errorTypes from '../constants/errorTypes';
import defaultDict from '../helpers/defaultDict';
import requestAPI from '../helpers/requestAPI';
import mediaUploader from '../helpers/mediaUploader';

import { PATIENT_DATA_LOADED, PROFILE_UPDATED } from '../actions/infoActions';

const retrieveToken = (authProvider) =>
  authProvider.currentUser.getIdToken(true);

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

function* patientProfileEditSaga(action) {
  try {
    const { photoUpdated, updateData, photo } = action.payload;
    const { auth, id } = yield select((state) => ({
      auth: state.authReducer.auth,
      id: state.authReducer.userData._id,
    }));

    const sendData = [];

    if (photoUpdated) {
      sendData.push(
        { name: 'id', data: String(id) },
        { name: 'photoUpdated', data: String(photoUpdated) },
        { name: 'updateData', data: JSON.stringify(updateData) },
        {
          name: 'photos',
          filename: `${id}-avatar.${photo.type.split('/')[1]}`,
          type: photo.type,
          data: RNFetchBlob.wrap(photo.uri),
        },
      );
    } else {
      sendData.push(
        { name: 'id', data: id },
        { name: 'photoUpdated', data: String(photoUpdated) },
        { name: 'updateData', data: JSON.stringify(updateData) },
      );
    }

    const authToken = yield call(retrieveToken, auth);

    const { response, error } = yield call(
      mediaUploader,
      'PUT',
      'https://teledermatology.herokuapp.com/patient/updateProfile',
      authToken,
      sendData,
    );

    console.log('Formdata: ', sendData);
    console.log('Response here: ', response);
    console.log('Error here: ', error);

    if (error) {
      yield call(rejectPromiseAction, action, error);
    } else if (response) {
      yield put({ type: PROFILE_UPDATED, payload: { userData: response } });
      yield call(resolvePromiseAction, action, 'Profile Edited');
    }
  } catch (err) {
    console.log(err);
    yield call(rejectPromiseAction, action, {
      type: errorTypes.COMMON.INTERNAL_ERROR,
    });
  }
}

function* doctorProfileEditSaga(action) {
  try {
    const { photoUpdated, updateData, photo } = action.payload;
    const { auth, id } = yield select((state) => ({
      auth: state.authReducer.auth,
      id: state.authReducer.userData._id,
    }));

    delete updateData.startTime;
    delete updateData.endTime;

    const sendData = [];

    if (photoUpdated) {
      sendData.push(
        { name: 'id', data: String(id) },
        { name: 'photoUpdated', data: String(photoUpdated) },
        { name: 'updateData', data: JSON.stringify(updateData) },
        {
          name: 'photos',
          filename: `${id}-avatar.${photo.type.split('/')[1]}`,
          type: photo.type,
          data: RNFetchBlob.wrap(photo.uri),
        },
      );
    } else {
      sendData.push(
        { name: 'id', data: id },
        { name: 'photoUpdated', data: String(photoUpdated) },
        { name: 'updateData', data: JSON.stringify(updateData) },
      );
    }

    const authToken = yield call(retrieveToken, auth);

    const { response, error } = yield call(
      mediaUploader,
      'PUT',
      'https://teledermatology.herokuapp.com/doctor/updateProfile',
      authToken,
      sendData,
    );

    console.log('Formdata: ', sendData);
    console.log('Response here: ', response);
    console.log('Error here: ', error);

    if (error) {
      yield call(rejectPromiseAction, action, error);
    } else if (response) {
      yield put({ type: PROFILE_UPDATED, payload: { userData: response } });
      yield call(resolvePromiseAction, action, 'Profile Edited');
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

export {
  loadPatientDataSaga,
  loadDoctorDataSaga,
  patientProfileEditSaga,
  doctorProfileEditSaga,
  fetchDoctorsSaga,
};
