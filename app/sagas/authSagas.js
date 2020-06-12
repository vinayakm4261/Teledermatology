import { put, call, select } from 'redux-saga/effects';
import {
  resolvePromiseAction,
  rejectPromiseAction,
} from '@adobe/redux-saga-promise';

import API from '../config/API';
import {
  SET_AUTH,
  PHONE_COMPLETE,
  NEW_REGISTER,
  AUTH_COMPLETE,
  LOAD_COMPLETE,
} from '../actions/authActions';

import errorTypes from '../constants/errorTypes';
import defaultDict from '../helpers/defaultDict';
import { APP_LOADED } from '../actions/localeActions';

const responseCodeErrorMap = defaultDict(
  {
    404: errorTypes.COMMON.INTERNAL_ERROR,
    500: errorTypes.COMMON.SERVER_ERROR,
    422: errorTypes.COMMON.INVALID_REQUEST,
    400: errorTypes.COMMON.INTERNAL_ERROR,
  },
  errorTypes.COMMON.NETWORK_ERROR,
);

const firebaseErrorMap = defaultDict(
  {
    'auth/captcha-check-failed': errorTypes.AUTH.LOGIN.CAPTCHA_FAIL,
    'auth/invalid-phone-number': errorTypes.AUTH.LOGIN.INVALID_PHONE,
    'auth/missing-phone-number': errorTypes.AUTH.LOGIN.MISSING_PHONE,
    'auth/user-disabled': errorTypes.AUTH.LOGIN.BLOCKED_USER,
    'auth/invalid-verification-code': errorTypes.AUTH.LOGIN.INVALID_OTP,
    'auth/missing-verification-code': errorTypes.AUTH.LOGIN.MISSING_OTP,
  },
  errorTypes.COMMON.INTERNAL_ERROR,
);

const requestAPI = (route, request, payload) =>
  API({
    url: route,
    method: request,
    data: payload,
  })
    .then((response) => ({ response: response.data, error: null }))
    .catch((err) => {
      const { status = {} } = err.response || {};

      return {
        response: null,
        error: { type: responseCodeErrorMap[status] },
      };
    });

const retrieveToken = (authProvider) =>
  authProvider.currentUser.getIdToken(true);

const phoneAuth = (authProvider, phoneNumber) =>
  authProvider
    .signInWithPhoneNumber(phoneNumber)
    .then((confirmation) => ({ confirmation, error: null }))
    .catch((err) => {
      return { confirm: null, error: { type: firebaseErrorMap[err.code] } };
    });

const otpAuth = (authProvider, otp) =>
  authProvider
    .confirm(otp)
    .then(({ phoneNumber, uid }) => ({ phoneNumber, uid, error: null }))
    .catch((err) => {
      return {
        phoneNumber: null,
        uid: null,
        otpError: { type: firebaseErrorMap[err.code] },
      };
    });

function* authLoadedSaga(action) {
  try {
    const auth = action.payload;

    yield put({ type: SET_AUTH, payload: { auth } });

    yield call(resolvePromiseAction, action, {});
  } catch (err) {
    console.log(err);
    yield call(rejectPromiseAction, action, {
      type: errorTypes.COMMON.INTERNAL_ERROR,
    });
  }
}

function* appLoadedSaga(action) {
  try {
    const { authLoaded, auth } = yield select((state) => ({
      authLoaded: state.authReducer.authLoaded,
      auth: state.authReducer.auth,
    }));

    if (authLoaded && auth) {
      yield put({ type: APP_LOADED });
      yield call(resolvePromiseAction, action, {});
    } else {
      yield call(rejectPromiseAction, action, {});
    }
  } catch (err) {
    console.log(err);
    yield call(rejectPromiseAction, action, {
      type: errorTypes.COMMON.INTERNAL_ERROR,
    });
  }
}

function* loadUserDataSaga(action) {
  try {
    const auth = yield select((state) => state.authReducer.auth);

    const user = auth.currentUser;

    if (user) {
      API.defaults.headers.common.authtoken = yield call(retrieveToken, auth);

      const { uid } = user;

      const { response, error } = yield call(
        requestAPI,
        '/patient/login',
        'POST',
        { _id: uid },
      );

      if (error) {
        yield call(rejectPromiseAction, action, error);
      } else if (response) {
        if (response.new) {
          yield call(resolvePromiseAction, action, {});
        } else {
          yield put({
            type: LOAD_COMPLETE,
            payload: { user: { ...response.user } },
          });
          yield call(resolvePromiseAction, action, {});
        }
      }
    } else {
      yield call(resolvePromiseAction, action, {});
    }
  } catch (err) {
    console.log(err);
    yield call(rejectPromiseAction, action, {
      type: errorTypes.COMMON.INTERNAL_ERROR,
    });
  }
}

function* loginWithPhoneSaga(action) {
  try {
    const { phoneNumber } = action.payload;

    const auth = yield select((state) => state.authReducer.auth);

    const { confirmation, error } = yield call(phoneAuth, auth, phoneNumber);

    if (error) {
      yield call(rejectPromiseAction, action, error);
    } else if (confirmation) {
      yield put({ type: PHONE_COMPLETE, payload: { confirmation } });
      yield call(resolvePromiseAction, action, 'Confirmation Received');
    }
  } catch (err) {
    console.log(err);
    yield call(rejectPromiseAction, action, {
      type: errorTypes.COMMON.INTERNAL_ERROR,
    });
  }
}

function* otpSaga(action) {
  try {
    const { otp } = action.payload;

    const { confirmation, auth } = yield select((state) => ({
      confirmation: state.authReducer.authState.confirmation,
      auth: state.authReducer.auth,
    }));

    const { phoneNumber, uid, otpError } = yield call(
      otpAuth,
      confirmation,
      otp,
    );

    if (otpError) {
      yield call(rejectPromiseAction, action, otpError);
    } else if (phoneNumber && uid) {
      API.defaults.headers.common.authtoken = yield call(retrieveToken, auth);

      const { response, error } = yield call(
        requestAPI,
        '/patient/login',
        'POST',
        { _id: uid },
      );

      if (error) {
        yield call(rejectPromiseAction, action, error);
      } else if (response) {
        if (response.new) {
          yield put({ type: NEW_REGISTER, payload: { uid, phoneNumber } });
          yield call(resolvePromiseAction, action, {
            ...response,
            navigate: 'RegisterScreen',
          });
        } else {
          yield put({
            type: AUTH_COMPLETE,
            payload: { user: { ...response.user } },
          });
          yield call(resolvePromiseAction, action, {
            new: false,
            navigate: 'HomeScreen',
          });
        }
      }
    }
  } catch (err) {
    console.log(err);
    yield call(rejectPromiseAction, action, {
      type: errorTypes.COMMON.INTERNAL_ERROR,
    });
  }
}

function* registerSaga(action) {
  try {
    const userData = action.payload;

    const { _id, phoneNumber } = yield select((state) => ({
      _id: state.authReducer.userData._id,
      phoneNumber: state.authReducer.userData.phoneNumber,
    }));

    const { response, error } = yield call(
      requestAPI,
      '/patient/register',
      'POST',
      { _id, phoneNumber, ...userData },
    );

    if (error) {
      yield call(rejectPromiseAction, action, error);
    } else if (response) {
      yield put({ type: AUTH_COMPLETE, payload: { ...response } });
      yield call(resolvePromiseAction, action, 'Register Done');
    }
  } catch (err) {
    console.log(err);
    yield call(rejectPromiseAction, action, {
      type: errorTypes.COMMON.INTERNAL_ERROR,
    });
  }
}

export {
  authLoadedSaga,
  appLoadedSaga,
  loadUserDataSaga,
  loginWithPhoneSaga,
  otpSaga,
  registerSaga,
};
