import { AUTH_COMPLETE } from '../actions/authActions';

const initialState = {
  isLoggedIn: false,
  uid: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_COMPLETE:
      return {
        ...state,
        isLoggedIn: true,
        // uid: action.uid,
      };
    default:
      return state;
  }
};

export default reducer;
