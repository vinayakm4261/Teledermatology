import { SET_DB, MESSAGES_FETCHED, NEW_CHAT } from '../actions/chatActions';

const initialState = {
  appointmentID: '0d6de1984cd81bd295f4b3f9',
  doctorID: 'dA9WPHdt3QetWffUrRjFXnEfMUR2',
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
    case NEW_CHAT:
      return {
        ...state,
        chats: {
          [action.payload.key]: {
            initial: 'chatInit',
          },
        },
      };
    case MESSAGES_FETCHED:
      return {
        ...state,
        chats: {
          ...action.payload.chats,
        },
      };
    default:
      return state;
  }
};

export default reducer;
