import { SIGN_OUT } from '../actions/authActions';
import {
  PATIENT_DATA_LOADED,
  DOCTOR_DATA_LOADED,
} from '../actions/infoActions';

const initialState = {
  dataLoaded: false,
  appointments: [],
  doctors: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case PATIENT_DATA_LOADED:
      return {
        ...state,
        dataLoaded: true,
        appointments: action.payload.appointments,
      };
    case DOCTOR_DATA_LOADED:
      return {
        ...state,
        dataLoaded: true,
        appointments: action.payload.appointments,
      };
    case SIGN_OUT:
      return {
        dataLoaded: false,
        appointments: [],
        doctors: [],
      };
    default:
      return state;
  }
};

export default reducer;
