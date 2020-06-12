import {
  SET_AUTH,
  PHONE_COMPLETE,
  NEW_REGISTER,
  AUTH_COMPLETE,
  LOAD_COMPLETE,
  SET_LOADED,
} from '../actions/authActions';

const initialState = {
  authLoaded: false,
  auth: {},
  userLoggedIn: false,
  userRegistered: false,
  userDataLoaded: false,
  authState: {},
  userData: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTH:
      return {
        ...state,
        authLoaded: true,
        auth: action.payload.auth,
      };
    case 'PHONE_LOGIN.TRIGGER':
      return {
        ...state,
        authState: {
          phoneNumber: action.payload,
        },
      };
    case PHONE_COMPLETE:
      return {
        ...state,
        authState: {
          ...state.authState,
          confirmation: action.payload.confirmation,
        },
      };
    case NEW_REGISTER:
      return {
        ...state,
        userLoggedIn: true,
        userData: {
          ...state.userData,
          _id: action.payload.uid,
          phoneNumber: action.payload.phoneNumber,
        },
      };
    case LOAD_COMPLETE:
      return {
        ...state,
        userLoggedIn: true,
        userRegistered: true,
        userData: {
          ...state.userData,
          ...action.payload.user,
        },
      };
    case SET_LOADED:
      return {
        ...state,
        userDataLoaded: true,
      };
    case AUTH_COMPLETE:
      return {
        ...state,
        userLoggedIn: true,
        userRegistered: true,
        userDataLoaded: true,
        userData: {
          ...state.userData,
          ...action.payload.user,
        },
      };
    default:
      return state;
  }
};

export default reducer;
