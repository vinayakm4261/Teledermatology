import { createPromiseAction } from '@adobe/redux-saga-promise';

export const NEW_MESSAGE = 'NEW_MESSAGE';
export const SET_DB = 'SET_DB';

export const setDatabaseAction = createPromiseAction('SET_DB');

export const initChatAction = createPromiseAction('INIT_CHAT');

export const fetchMessagesAction = createPromiseAction('FETCH_MESSAGES');

export const sendMessageAction = createPromiseAction('SEND_MESSAGE');
