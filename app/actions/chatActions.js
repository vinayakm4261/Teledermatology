import { createPromiseAction } from '@adobe/redux-saga-promise';

export const SET_DB = 'SET_DB';
export const NEW_CHAT = 'NEW_CHAT';
export const NEW_MESSAGE = 'NEW_MESSAGE';
export const MESSAGES_FETCHED = 'MESSAGES_FETCHED';
export const MESSAGE_RECEIVED = 'MESSAGE_RECEIVED';
export const MESSAGE_SENT = 'MESSAGE_SENT';

export const setDatabaseAction = createPromiseAction('SET_DB');

export const initChatAction = createPromiseAction('INIT_CHAT');

export const sendMessageAction = createPromiseAction('SEND_MESSAGE');

export const exitChatAction = createPromiseAction('EXIT_CHAT');
