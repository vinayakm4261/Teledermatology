import { SIGN_OUT } from '../actions/authActions';
import {
  PATIENT_DATA_LOADED,
  DOCTOR_DATA_LOADED,
  DOCTORS_FETCHED,
  NEW_APPOINTMENT_DONE,
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
    case DOCTORS_FETCHED:
      return {
        ...state,
        doctors: action.payload.doctors,
      };
    case NEW_APPOINTMENT_DONE:
      return {
        ...state,
        appointments: [...state.appointments, action.payload.appointment],
      };
    default:
      return state;
  }
};

export default reducer;
