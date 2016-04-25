import Config from '~/core/config';
import Primus from '~/helpers/Primus';
import { forEach, omit, without } from 'lodash';

const SOCKET_CONNECTION_INIT = 'SOCKET_CONNECTION_INIT';
const SOCKET_CONNECTION_SUCCESS = 'SOCKET_CONNECTION_SUCCESS';
const SOCKET_CONNECTION_ERROR = 'SOCKET_CONNECTION_ERROR';
const SOCKET_CONNECTION_RETRY = 'SOCKET_CONNECTION_RETRY';
const SOCKET_CONNECTION_RESET = 'SOCKET_CONNECTION_RESET';
const SOCKET_MESSAGE = 'SOCKET_MESSAGE';

const initialState = {
  connected: false,
  connecting: false,
  error: null,
  hostname: null,
  message: null,
  socket: null,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SOCKET_CONNECTION_INIT:
      return Object.assign({}, state, {
        connected: false,
        connecting: true,
        error: null,
        hostname: action.hostname,
        socket: null,
      });

    case SOCKET_CONNECTION_SUCCESS:
      return Object.assign({}, state, {
        connected: true,
        connecting: false,
        error: null,
        socket: action.socket,
      });

    case SOCKET_CONNECTION_ERROR:
      return Object.assign({}, state, {
        connected: false,
        connecting: false,
        error: action.error,
      });

    case SOCKET_CONNECTION_RETRY:
      return Object.assign({}, state, {
        connected: false,
        connecting: true,
        error: null,
      });

    case SOCKET_CONNECTION_RESET:
      return Object.assign({}, state, {
        connected: false,
        connecting: false,
        error: null,
        socket: null,
      });

    case SOCKET_MESSAGE:
      return Object.assign({}, state, {
        message: action.data,
      });

    default:
      return state;
  }
}

function socketConnectionInit(hostname) {
  return {
    type: SOCKET_CONNECTION_INIT,
    hostname,
  };
}

function socketConnectionSuccess(socket) {
  return {
    type: SOCKET_CONNECTION_SUCCESS,
    socket,
  };
}

function socketConnectionError(error) {
  return {
    type: SOCKET_CONNECTION_ERROR,
    error,
  };
}

function socketConnectionRetry() {
  return {
    type: SOCKET_CONNECTION_RETRY,
  };
}

export function socketConnectionReset() {
  return {
    type: SOCKET_CONNECTION_RESET,
  };
}

function socketMessage(data) {
  return {
    type: SOCKET_MESSAGE,
    data,
  };
}

export function initializeSocket(hostname, callback = () => {}) {
  return (dispatch) => {
    const socket = Primus.connect(hostname, {
      reconnect: Config.socketReconnectStrategy,
    });

    dispatch(socketConnectionInit(hostname));

    socket.on('open', () => {
      dispatch(socketConnectionSuccess(socket));
      callback();
    });

    socket.on('reconnect', () => dispatch(socketConnectionRetry()));
    socket.on('reconnect failed', () => {
      dispatch(socketConnectionError('Connection failed, server is not responding.'));
    });
  };
}
