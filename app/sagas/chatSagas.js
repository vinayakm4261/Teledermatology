import { take, put, select, call, fork, takeEvery } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import {
  resolvePromiseAction,
  rejectPromiseAction,
} from '@adobe/redux-saga-promise';
import database from '@react-native-firebase/database';

import errorTypes from '../constants/errorTypes';
import defaultDict from '../helpers/defaultDict';

import {
  SET_DB,
  MESSAGES_FETCHED,
  NEW_CHAT,
  MESSAGE_RECEIVED,
  MESSAGE_SENT,
} from '../actions/chatActions';

const databaseErrorMap = defaultDict(
  {
    cancelled: errorTypes.DATABASE.CANCELLED,
    'invalid-argument': errorTypes.DATABASE.INVALID_ARGUMENT,
  },
  errorTypes.COMMON.INTERNAL_ERROR,
);

const checkChatNode = (reference, path) =>
  reference
    .child(path)
    .once('value')
    .then((snapshot) => ({ snapshot, error: null }))
    .catch((err) => ({
      snapshot: null,
      error: { type: databaseErrorMap[err.code] },
    }));

const createChatNode = (reference, path) => {
  const createRef = reference.child(path).push();

  const data = {
    _id: createRef.key,
    text: 'Discuss with your doctor over messages',
    createdAt: Date.now(),
    system: true,
  };

  return createRef
    .set(data)
    .then(() => ({ message: { [createRef.key]: { ...data } }, error: null }))
    .catch((err) => ({ message: null, error: databaseErrorMap[err.code] }));
};

const sendMessage = (
  reference,
  path,
  author,
  name,
  profilePic,
  text = '',
  media = [],
) => {
  const createRef = reference.child(path).push();

  const data = {
    _id: createRef.key,
    text,
    createdAt: Date.now(),
    user: {
      _id: author,
      name,
      avatar: profilePic,
    },
  };

  return createRef
    .set(data)
    .then(() => ({ message: { [createRef.key]: { ...data } }, error: null }))
    .catch((err) => ({ message: null, error: databaseErrorMap[err.code] }));
};

const createChatChannel = (reference, path) => {
  const listener = eventChannel((emit) => {
    reference
      .child(path)
      .limitToLast(1)
      .on('child_added', (snapshot) => {
        emit({ [snapshot.key]: snapshot.val() });
      });

    return () => reference.child(path).off('child_added');
  });

  return listener;
};

function* setDatabaseSaga(action) {
  try {
    const reference = database().ref(action.payload);

    yield put({ type: SET_DB, payload: { reference } });

    yield call(resolvePromiseAction, action, {});
  } catch (err) {
    console.log(err);
    yield call(rejectPromiseAction, action, {
      type: errorTypes.COMMON.INTERNAL_ERROR,
    });
  }
}

function* initChatSaga(action) {
  try {
    const { appointmentID, receiverID } = action.payload;

    const ref = yield select((state) => state.chatReducer.database);

    const { snapshot, error } = yield call(checkChatNode, ref, appointmentID);

    if (error) {
      yield call(rejectPromiseAction, action, error);
    } else {
      if (snapshot.val()) {
        yield put({
          type: MESSAGES_FETCHED,
          payload: { chats: snapshot.val(), receiverID, appointmentID },
        });

        yield call(resolvePromiseAction, action, {});

        const chatChannel = yield call(createChatChannel, ref, appointmentID);

        yield takeEvery(chatChannel, function* (newMessage) {
          yield put({ type: MESSAGE_RECEIVED, payload: { ...newMessage } });
        });

        const closeChannel = yield take('EXIT_CHAT.TRIGGER');

        chatChannel.close();

        yield call(resolvePromiseAction, closeChannel, {});
      } else {
        const { message, error2 } = yield call(
          createChatNode,
          ref,
          appointmentID,
        );

        if (error2) {
          yield call(rejectPromiseAction, action, error2);
        } else if (message) {
          yield put({
            type: NEW_CHAT,
            payload: { chat: { ...message }, receiverID, appointmentID },
          });

          yield call(resolvePromiseAction, action, {});

          const chatChannel = yield call(createChatChannel, ref, appointmentID);

          yield takeEvery(chatChannel, function* (newMessage) {
            yield put({
              type: MESSAGE_RECEIVED,
              payload: { ...newMessage },
            });
          });

          const closeChannel = yield take('EXIT_CHAT.TRIGGER');

          chatChannel.close();

          yield call(resolvePromiseAction, closeChannel, {});
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

function* initChatWatcher(action) {
  yield fork(initChatSaga, action);
}

function* sendMessageSaga(action) {
  try {
    const { text, media = [] } = action.payload;

    const {
      ref,
      userID,
      appointmentID,
      chats,
      name,
      profilePic,
    } = yield select((state) => ({
      ref: state.chatReducer.database,
      appointmentID: state.chatReducer.appointmentID,
      userID: state.authReducer.userData._id,
      chats: state.chatReducer.chats,
      name: state.authReducer.userData.name,
      profilePic: state.authReducer.userData.profilePic,
    }));

    if (Object.keys(chats).length === 0) {
      console.log('Initialise chat channel');
      yield call(rejectPromiseAction, action, {
        type: errorTypes.COMMON.INTERNAL_ERROR,
      });
    } else {
      const { message, error } = yield call(
        sendMessage,
        ref,
        appointmentID,
        userID,
        name,
        profilePic,
        text,
        media,
      );

      if (error) {
        yield call(rejectPromiseAction, action, error);
      } else if (message) {
        yield put({ type: MESSAGE_SENT, payload: { ...message } });
        yield call(resolvePromiseAction, action, {});
      }
    }
  } catch (err) {
    console.log(err);
    yield call(rejectPromiseAction, action, {
      type: errorTypes.COMMON.INTERNAL_ERROR,
    });
  }
}

function* sendMessageWatcher(action) {
  yield fork(sendMessageSaga, action);
}

export { setDatabaseSaga, initChatWatcher, sendMessageWatcher };
