import Config from '~/core/config';
import { rejoinChannels, resetChat } from '~/redux/chat';
import { socketConnectReset } from '~/redux/primus';
import { toggleSideBar } from '~/redux/navigation';

const LOGIN_PENDING = 'LOGIN_REQUEST';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_ERROR = 'LOGIN_ERROR';
const LOGIN_RESET = 'LOGIN_RESET';

const initialState = {
  error: null,
  loggedIn: false,
  requesting: false,
  username: 'N/A',
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOGIN_PENDING:
      return Object.assign({}, state, {
        error: null,
        loggedIn: false,
        requesting: true,
        username: action.username,
      });

    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        error: null,
        loggedIn: true,
        requesting: false,
      });

    case LOGIN_ERROR:
      return Object.assign({}, state, {
        error: action.error,
        loggedIn: false,
        requesting: false,
        username: 'N/A',
      });

    case LOGIN_RESET:
      return Object.assign({}, state, {
        error: null,
        loggedIn: false,
        requesting: false,
        username: 'N/A',
      });

    default:
      return state;
  }
}

function loginPending(username) {
  return {
    type: LOGIN_PENDING,
    username,
  };
}

function loginSuccess() {
  return {
    type: LOGIN_SUCCESS,
  };
}

export function loginError(error) {
  return {
    type: LOGIN_ERROR,
    error,
  };
}

export function loginReset() {
  return {
    type: LOGIN_RESET,
  };
}

export function requestLogout(callback = () => {}) {
  return (dispatch, getState) => {
    const store = getState();
    const { loggedIn } = store.login;
    const { socket } = store.primus;

    if (!loggedIn) {
      callback();
    } else {
      socket.on('end', () => {
        dispatch(loginReset());
        dispatch(resetChat());
        dispatch(socketConnectReset());
        dispatch(toggleSideBar(false));
        callback();
      });

      socket.destroy();
    }
  };
}

export function requestLogin(username, callback = () => {}) {
  return (dispatch, getState) => {
    const { socket } = getState().primus;

    function auth(cb = () => {}) {
      dispatch(loginPending(username));

      socket.writeAndWait({
        action: 'login',
        data: {
          idleChannel: Config.idleChannel,
          username,
        },
      }, (err) => {
        if (err) {
          dispatch(loginError(err));
        } else {
          dispatch(loginSuccess());
        }
        cb(err);
      });
    }

    function reLogin() {
      const { chat, login } = getState();

      if (
        chat.initialized
        && !login.loggedIn
        && !login.requesting
      ) {
        auth(() => {
          dispatch(rejoinChannels());
        });
      }
    }

    socket.on('open', reLogin);
    socket.on('reconnected', reLogin);
    socket.on('reconnect', () => dispatch(loginReset()));

    auth(callback);
  };
}
