import {
  SET_DB,
  MESSAGES_FETCHED,
  NEW_CHAT,
  MESSAGE_RECEIVED,
  MESSAGE_SENT,
} from '../actions/chatActions';

const initialState = {
  appointmentID: '',
  receiverID: '',
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
        appointmentID: action.payload.appointmentID,
        receiverID: action.payload.receiverID,
        chats: {
          ...action.payload.chat,
        },
      };
    case MESSAGES_FETCHED:
      return {
        ...state,
        appointmentID: action.payload.appointmentID,
        receiverID: action.payload.receiverID,
        chats: {
          ...action.payload.chats,
        },
      };
    case MESSAGE_SENT:
      if (Object.keys(state.chats).includes(Object.keys(action.payload))) {
        return state;
      } else {
        return {
          ...state,
          chats: {
            ...state.chats,
            ...action.payload,
          },
        };
      }
    case MESSAGE_RECEIVED:
      if (Object.keys(state.chats).includes(Object.keys(action.payload))) {
        return state;
      } else {
        return {
          ...state,
          chats: {
            ...state.chats,
            ...action.payload,
          },
        };
      }
    case 'EXIT_CHAT.TRIGGER':
      return {
        ...state,
        appointmentID: '',
        receiverID: '',
        chats: {},
      };
    default:
      return state;
  }
};

export default reducer;
