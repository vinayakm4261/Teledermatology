import { PermissionsAndroid } from 'react-native';
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
  PATIENT_DATA_LOADED,
  PROFILE_UPDATED,
  NEW_APPOINTMENT_DONE,
} from '../actions/infoActions';

const retrieveToken = (authProvider) =>
  authProvider.currentUser.getIdToken(true);

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

function* newAppointmentSaga(action) {
  try {
    const appointmentData = action.payload;

    console.log(appointmentData);

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
            data.forEach(({ type, uri, mime }, index) => {
              switch (type) {
                case 'image':
                  sendData.push({
                    name: 'photos',
                    filename: `image-${index}.${mime.split('/')[1]}`,
                    type: mime,
                    data: RNFetchBlob.wrap(uri),
                  });
                  break;
                case 'video':
                  sendData.push({
                    name: 'videos',
                    filename: `video-${index}.${mime.split('/')[1]}`,
                    type: mime,
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

    console.log(sendData);

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
  patientProfileEditSaga,
  doctorProfileEditSaga,
  initVideoCallSaga,
  fetchDoctorsSaga,
  newAppointmentSaga,
};
