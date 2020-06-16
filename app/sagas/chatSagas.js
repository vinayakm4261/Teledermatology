import { take, put, select, call } from 'redux-saga/effects';
import {
  resolvePromiseAction,
  rejectPromiseAction,
} from '@adobe/redux-saga-promise';
import database from '@react-native-firebase/database';

import errorTypes from '../constants/errorTypes';
import defaultDict from '../helpers/defaultDict';

import { SET_DB } from '../actions/chatActions';

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

const createChatNode = (reference, path) =>
  reference
    .child(path)
    .set({
      initial: 'chatInit',
    })
    .then(() => ({ success: true, error: null }))
    .catch((err) => ({ success: null, error: databaseErrorMap[err.code] }));

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
    const id = action.payload;

    const ref = yield select((state) => state.chatReducer.database);

    const { snapshot, error } = yield call(checkChatNode, ref, id);

    if (error) {
      console.log('Error: ', error);
      yield call(rejectPromiseAction, action, error);
    } else {
      if (snapshot.val()) {
        // TODO: Dispatch messages fetched action
        console.log('Node is present', snapshot.val());
      } else {
        console.log('Have to create node');

        const { success, error2 } = yield call(createChatNode, ref, id);

        if (error2) {
          console.log('Error2: ', error2);
        } else if (success) {
          // TODO: Dispatch new chat action
          console.log('Chat node created');
        }
      }
    }
  } catch (err) {
    console.log('Catch error', err);
    yield call(rejectPromiseAction, action, {
      type: errorTypes.COMMON.INTERNAL_ERROR,
    });
  }
}

export { setDatabaseSaga, initChatSaga };
