import { take, put, select, call, fork } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import {
  resolvePromiseAction,
  rejectPromiseAction,
} from '@adobe/redux-saga-promise';
import database from '@react-native-firebase/database';

import errorTypes from '../constants/errorTypes';
import defaultDict from '../helpers/defaultDict';

import { SET_DB, MESSAGES_FETCHED, NEW_CHAT } from '../actions/chatActions';

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

const createChatNode = (
  reference,
  path,
  author,
  receiver,
  content = 'Chat Init',
) => {
  const createRef = reference.child(path).push();

  return createRef
    .set({
      author,
      receiver,
      content,
      timeStamp: Date.now(),
    })
    .then(() => ({ key: createRef.key, error: null }))
    .catch((err) => ({ key: null, error: databaseErrorMap[err.code] }));
};

const createChatChannel = (reference, path) => {
  const listener = eventChannel((emit) => {
    reference
      .child(path)
      .on('child_added', (snapshot) =>
        emit({ [snapshot.key]: snapshot.val() }),
      );

    return () => reference.child(path).off(listener);
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
    const appointmentID = action.payload;

    const { ref, userID, doctorID } = yield select((state) => ({
      ref: state.chatReducer.database,
      userID: state.authReducer.userData._id,
      doctorID: state.chatReducer.doctorID,
    }));

    const { snapshot, error } = yield call(checkChatNode, ref, appointmentID);

    if (error) {
      yield call(rejectPromiseAction, action, error);
    } else {
      if (snapshot.val()) {
        yield put({
          type: MESSAGES_FETCHED,
          payload: { chats: snapshot.val() },
        });

        yield call(resolvePromiseAction, action, {});

        const chatChannel = yield call(createChatChannel, ref, appointmentID);

        while (true) {
          const newMessage = yield take(chatChannel);
          console.log('New Message is here existing:', newMessage);
        }
      } else {
        const { key, error2 } = yield call(
          createChatNode,
          ref,
          appointmentID,
          userID,
          doctorID,
        );

        if (error2) {
          yield call(rejectPromiseAction, action, error2);
        } else if (key) {
          yield put({ type: NEW_CHAT, payload: { key } });

          yield call(resolvePromiseAction, action, {});

          const chatChannel = yield call(createChatChannel, ref, appointmentID);

          while (true) {
            const newMessage = yield take(chatChannel);
            console.log('New Message is here new:', newMessage);
          }
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

export { setDatabaseSaga, initChatWatcher };
