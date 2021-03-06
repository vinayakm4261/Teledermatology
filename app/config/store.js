import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import createSagaMiddleWare from 'redux-saga';
import { promiseMiddleware } from '@adobe/redux-saga-promise';

import reducer from '../reducers';
import rootSaga from '../sagas';

const sagaMiddleWare = createSagaMiddleWare();
const middleware = [promiseMiddleware, sagaMiddleWare];

if (process.env.NODE_ENV === 'development') {
  middleware.push(logger);
}

const store = createStore(reducer, applyMiddleware(...middleware));

sagaMiddleWare.run(rootSaga);

export default store;
