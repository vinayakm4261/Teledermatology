import { SET_DB } from '../actions/chatActions';

const initialState = {
  appointmentID: '',
  database: {},
  chats: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DB:
      return {
        ...state,
        database: action.payload.reference,
      };
    default:
      return state;
  }
};

export default reducer;
