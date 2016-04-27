import Config from '~/core/config';
import Primus from '~/helpers/Primus';

const SOCKET_CONNECT_INIT = 'SOCKET_CONNECT_INIT';
const SOCKET_CONNECT_SUCCESS = 'SOCKET_CONNECT_SUCCESS';
const SOCKET_CONNECT_ERROR = 'SOCKET_CONNECT_ERROR';
const SOCKET_CONNECT_RETRY = 'SOCKET_CONNECT_RETRY';
const SOCKET_CONNECT_RESET = 'SOCKET_CONNECT_RESET';
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
    case SOCKET_CONNECT_INIT:
      return Object.assign({}, state, {
        connected: false,
        connecting: true,
        error: null,
        hostname: action.hostname,
        socket: null,
      });

    case SOCKET_CONNECT_SUCCESS:
      return Object.assign({}, state, {
        connected: true,
        connecting: false,
        error: null,
        socket: action.socket,
      });

    case SOCKET_CONNECT_ERROR:
      return Object.assign({}, state, {
        connected: false,
        connecting: false,
        error: action.error,
      });

    case SOCKET_CONNECT_RETRY:
      return Object.assign({}, state, {
        connected: false,
        connecting: true,
        error: null,
      });

    case SOCKET_CONNECT_RESET:
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

function socketConnectInit(hostname) {
  return {
    type: SOCKET_CONNECT_INIT,
    hostname,
  };
}

function socketConnectSuccess(socket) {
  return {
    type: SOCKET_CONNECT_SUCCESS,
    socket,
  };
}

function socketConnectError(error) {
  return {
    type: SOCKET_CONNECT_ERROR,
    error,
  };
}

function socketConnectRetry() {
  return {
    type: SOCKET_CONNECT_RETRY,
  };
}

export function socketConnectReset() {
  return {
    type: SOCKET_CONNECT_RESET,
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
    const socket = Primus.connect(hostname, { strategy: false });
    const failedConnection = (err = {}) => {
      dispatch(socketConnectError(
        err.message
        || 'Connection failed, server is not responding.'
      ));
    };
    let reconnectEnabled = false;

    dispatch(socketConnectInit(hostname));

    socket.on('open', () => {
      if (!reconnectEnabled) {
        reconnectEnabled = true;
        socket.enableReconnect(Config.socketReconnectStrategy);
        socket.on('reconnect', () => dispatch(socketConnectRetry()));
        socket.on('reconnect failed', failedConnection);
      }

      dispatch(socketConnectSuccess(socket));
      callback();
    });

    socket.on('error', (err) => failedConnection(err));
    socket.on('close', (err) => failedConnection(err));
  };
}
