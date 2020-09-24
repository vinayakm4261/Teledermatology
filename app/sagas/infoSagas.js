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

import {
  NEW_APPOINTMENT_DONE,
  PATIENT_DATA_LOADED,
} from '../actions/infoActions';

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
      yield call(resolvePromiseAction, action, response);
    }
  } catch (err) {
    console.log(err);
    yield call(rejectPromiseAction, action, {
      type: errorTypes.COMMON.INTERNAL_ERROR,
    });
  }
}

function* newAppointmentSaga(action) {
  try {
    const appointmentData = action.payload;

    const sendData = [];

    Object.entries(appointmentData).forEach(([field, data]) => {
      switch (field) {
        case 'symptoms':
          if (data.length > 0) {
            data.forEach((symptom) =>
              sendData.push({ name: 'symptoms[]', data: symptom }),
            );
          }
          break;
        case 'media':
          if (data.length > 0) {
            data.forEach(({ type, uri }, index) => {
              switch (type) {
                case 'image':
                  sendData.push({
                    name: 'photos',
                    filename: `image-${index}.jpg`,
                    type: 'image/jpeg',
                    data: RNFetchBlob.wrap(uri),
                  });
                  break;
                case 'video':
                  sendData.push({
                    name: 'videos',
                    filename: `video-${index}.mp4`,
                    type: 'video/mp4',
                    data: RNFetchBlob.wrap(uri),
                  });
                  break;
                case 'audio':
                  sendData.push({
                    name: 'audio',
                    filename: `audio-${index}.aac`,
                    type: 'audio/aac',
                    data: RNFetchBlob.wrap(uri),
                  });
              }
            });
          }
          break;
        default:
          sendData.push({ name: field, data: String(data) });
          break;
      }
    });

    const { auth, patientID } = yield select((state) => ({
      auth: state.authReducer.auth,
      patientID: state.authReducer.userData._id,
    }));

    sendData.push({ name: 'patientID', data: patientID });

    const authToken = yield call(retrieveToken, auth);

    const { response, error } = yield call(
      mediaUploader,
      'PUT',
      'https://teledermatology.herokuapp.com/patient/newAppointment',
      authToken,
      sendData,
    );

    console.log('Response', response);
    console.log('Error', error);

    if (error) {
      yield call(rejectPromiseAction, action, error);
    } else {
      yield put({
        type: NEW_APPOINTMENT_DONE,
        payload: { appointment: response.appointment },
      });
      yield call(resolvePromiseAction, action, {});
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
  fetchDoctorsSaga,
  newAppointmentSaga,
};
