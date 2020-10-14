import { createPromiseAction } from '@adobe/redux-saga-promise';

export const SET_AUTH = 'SET_AUTH';
export const SET_LOADED = 'SET_LOADED';
export const PHONE_COMPLETE = 'PHONE_COMPLETE';
export const OTP_COMPLETE = 'OTP_COMPLETE';
export const NEW_REGISTER = 'NEW_REGISTER';
export const LOAD_COMPLETE = 'LOAD_COMPLETE';
export const AUTH_COMPLETE = 'AUTH_COMPLETE';
export const AUTH_FAIL = 'AUTH_FAIL';
export const SIGN_OUT = 'SIGN_OUT';

export const setAuthAction = createPromiseAction('SET_AUTH');

export const setUserDataLoadedAction = () => ({
  type: SET_LOADED,
});

export const loadUserDataAction = createPromiseAction('LOAD_USER_DATA');

export const loginWithPhoneAction = createPromiseAction('PHONE_LOGIN');

export const otpAction = createPromiseAction('OTP_CONFIRM');

export const registerUserAction = createPromiseAction('REGISTER_USER');

export const signOutAction = createPromiseAction('SIGN_OUT_USER');
