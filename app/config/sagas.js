import { takeEvery, put, call, select } from 'redux-saga/effects';
import axios from 'axios';
import auth from '@react-native-firebase/auth';

// import API from './API';
import { OTP_CONFIRM, AUTH_FAIL, AUTH_COMPLETE } from '../actions/authActions';

const userRoute = (token, payload) =>
  axios({
    method: 'POST',
    url: '/patient/test',
    headers: { AuthToken: token },
    data: payload,
  })
    .then(({ status, data }) => ({ status, ...data }))
    .catch(({ message, response: { status } }) => ({ status, message }));

const retrieveToken = () =>
  auth()
    .currentUser.getIdToken(true)
    .then((token) => token)
    .catch((err) => alert(err));

function* testSaga(action) {
  try {
    if (auth().currentUser) {
      const authToken = yield call(retrieveToken);

      const userData = { phone: action.phone, uid: action.uid };

      if (authToken) {
        const response = yield call(userRoute, authToken, userData);

        console.log(response);

        if (response.status === 200) {
          if (response.new) {
            // yield put({ type: AUTH_COMPLETE });
            yield call(action.resolve, { navigate: 'Register' });
          } else {
            yield call(action.resolve, { navigate: 'Home' });
          }
        } else if (response.status === 400) {
          yield put({ type: AUTH_FAIL });
          yield call(action.reject, { _error: response.message });
        }
      }
    }
  } catch (err) {
    console.log(err);
    yield call(action.reject, { _error: 'An unexpected error occurred' });
    yield put({ type: AUTH_FAIL });
  }
}

export default function* rootSaga() {
  yield takeEvery(OTP_CONFIRM, testSaga);
}
