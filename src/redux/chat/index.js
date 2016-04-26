import Config from '~/core/config';
import Event from '~/helpers/Event';
import Error from '~/helpers/Error';
import { toggleSideBar } from '~/redux/navigation';
import { nth, omit, tail, without } from 'lodash';

const INITIALIZE_CHAT = 'INITIALIZE_CHAT';
const RESET_CHAT = 'RESET_CHAT';

const JOIN_CHANNEL = 'JOIN_CHANNEL';
const LEAVE_CHANNEL = 'LEAVE_CHANNEL';
const SWITCH_CHANNEL = 'SWITCH_CHANNEL';

const SEND_MESSAGE_PENDING = 'SEND_MESSAGE_PENDING';
const SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS';
const SEND_MESSAGE_ERROR = 'SEND_MESSAGE_ERROR';

const EVENT = 'EVENT';

const initialState = {
  activeChannel: Config.idleChannel,
  initialized: false,
  channels: {
    [Config.idleChannel]: {
      idle: true,
      users: [],
      events: [],
      viewed: true,
    },
  },
  error: null,
  pendingMessage: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case INITIALIZE_CHAT:
      return Object.assign({}, state, {
        initialized: true,
      });

    case JOIN_CHANNEL:
      return Object.assign({}, state, {
        activeChannel: (action.rejoin) ? state.activeChannel : action.channel,
        channels: Object.assign({}, state.channels, {
          [action.channel]: {
            idle: false,
            users: [],
            events: action.events,
            viewed: true,
          },
        }),
      });

    case LEAVE_CHANNEL:
      return Object.assign({}, state, {
        activeChannel: action.activeChannel,
        channels: omit(state.channels, action.channel),
      });

    case SEND_MESSAGE_PENDING:
      return Object.assign({}, state, {
        pendingMessage: true,
      });

    case SEND_MESSAGE_SUCCESS:
      return Object.assign({}, state, {
        pendingMessage: false,
      });

    case SEND_MESSAGE_ERROR:
      return Object.assign({}, state, {
        pendingMessage: false,
        error: action.error,
      });

    case EVENT:
    case SWITCH_CHANNEL:
      return Object.assign({}, state, action.payload);

    case RESET_CHAT:
      return initialState;

    default:
      return state;
  }
}

export function emitEvent(event = {}) {
  return (dispatch, getState) => {
    const { chat } = getState();
    const { activeChannel, channels } = chat;
    const data = event.data;
    const channel = data.channel || activeChannel;
    let c = channels[channel];
    let payload = {};

    switch (event.action) {
      case 'join':
      case 'leave':
        payload = {
          channels: Object.assign({}, channels, {
            [channel]: {
              ...c,
              events: [...c.events, data],
              users: data.users,
              viewed: (data.silent) ? c.viewed : activeChannel === channel,
            },
          }),
        };
        break;

      case 'quit':
        payload = {
          channels,
        };

        data.channels.forEach((chan) => {
          c = channels[chan];

          if (c) {
            const isInAC = channels[activeChannel].users.indexOf(data.username) !== -1;

            payload.channels = Object.assign({}, payload.channels, {
              [chan]: {
                ...c,
                events: [...c.events, data],
                viewed: (!isInAC) ? false : c.viewed,
              },
            });
          }
        });
        break;

      case 'event':
      case 'message':
        payload = {
          channels: Object.assign({}, channels, {
            [channel]: {
              ...c,
              events: [...c.events, data],
              viewed: (data.silent) ? c.viewed : activeChannel === channel,
            },
          }),
        };
        break;

      default:
        payload = event;
        break;
    }

    dispatch({
      type: EVENT,
      payload,
    });
  };
}

export function switchChannel(channel) {
  return (dispatch, getState) => {
    const { channels } = getState().chat;
    const c = channels[channel];

    dispatch({
      type: SWITCH_CHANNEL,
      payload: {
        activeChannel: channel,
        channels: Object.assign({}, channels, {
          [channel]: {
            ...c,
            viewed: true,
          },
        }),
      },
    });
  };
}

export function joinChannel(channel, rejoin = false) {
  return (dispatch, getState) => {
    const store = getState();
    const { socket } = store.primus;
    const { sidebarOpen } = store.navigation;
    const c = store.chat.channels[channel];

    if (c && !rejoin) {
      dispatch(switchChannel(channel));
    } else if (!c || rejoin) {
      socket.writeAndWait({
        action: 'join-channel',
        data: { channel },
      }, (err) => {
        if (err) {
          dispatch(emitEvent(new Error(err)));
        } else {
          dispatch({
            type: JOIN_CHANNEL,
            channel,
            events: (c) ? c.events : [],
            rejoin,
          });

          if (sidebarOpen) {
            dispatch(toggleSideBar(false));
          }
        }
      });
    }
  };
}

export function leaveChannel(channel) {
  return (dispatch, getState) => {
    const store = getState();
    const { socket } = store.primus;
    const { channels } = store.chat;
    const c = channels[channel];
    const keys = Object.keys(channels);
    const nextChannel = keys.indexOf(channel) - 1;
    let activeChannel = tail(without(keys, channel));

    if (nextChannel > -1) {
      activeChannel = nth(keys, nextChannel);
    }

    if (c) {
      socket.writeAndWait({
        action: 'leave-channel',
        data: { channel },
      }, (err) => {
        if (err) {
          dispatch(emitEvent(new Error(err)));
        } else {
          dispatch({
            type: LEAVE_CHANNEL,
            activeChannel,
            channel,
          });
        }
      });
    }
  };
}

export function rejoinChannels() {
  return (dispatch, getState) => {
    const { channels } = getState().chat;

    Object.keys(channels).forEach((channel) => {
      if (!channels[channel].idle) {
        dispatch(joinChannel(channel, true));
      }
    });
  };
}

function sendMessagePending() {
  return {
    type: SEND_MESSAGE_PENDING,
  };
}

function sendMessageSuccess() {
  return {
    type: SEND_MESSAGE_SUCCESS,
  };
}

function sendMessageError(error) {
  return {
    type: SEND_MESSAGE_ERROR,
    error,
  };
}

export function resetChat() {
  return {
    type: RESET_CHAT,
  };
}

export function sendMessage(message, callback = () => {}) {
  return (dispatch, getState) => {
    const store = getState();
    const { socket } = store.primus;
    const { activeChannel } = store.chat;
    dispatch(sendMessagePending());

    socket.writeAndWait({
      action: 'send-message',
      data: {
        channel: activeChannel,
        message,
      },
    }, (err) => {
      if (err) {
        dispatch(sendMessageError(err));
        dispatch(emitEvent(new Error(err)));
      } else {
        dispatch(sendMessageSuccess());
      }

      callback(err);
    });
  };
}

export function initializeChat() {
  return (dispatch, getState) => {
    const { socket } = getState().primus;

    dispatch({
      type: INITIALIZE_CHAT,
    });

    socket.on('open', () => dispatch(emitEvent(new Event('connected'))));
    socket.on('data', (data) => dispatch(emitEvent(data)));
    socket.on('reconnect', () => dispatch(emitEvent(new Event('reconnecting'))));
    socket.on('reconnect failed', () => dispatch(emitEvent(new Event('reconnect failed'))));
  };
}
