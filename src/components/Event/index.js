import React, { PropTypes } from 'react';
import Colors from '~/theme/Colors';
import Message from '~/components/Message';
import moment from 'moment';
import { connect } from 'react-redux';
import { emitEvent } from '~/redux/chat';
import { initializeSocket } from '~/redux/primus';

const getStyles = ({ style, color }) => (
  {
    outer: Object.assign({
      clear: 'both',
      float: 'left',
      marginBottom: 10,
    }, style),

    event: {
      color,
      float: 'left',
      fontSize: 14,
    },
  }
);

export class ChannelEvent extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    event: PropTypes.object.isRequired,
    login: PropTypes.object.isRequired,
    primus: PropTypes.object.isRequired,
    style: PropTypes.object,
  };

  render() {
    const {
      event,
      login,
      primus,
      style,
    } = this.props;
    const me = event.username === login.username;

    let parsedEvent = '';
    let timestamp = true;
    let color = Colors.secondaryText;

    switch (event.type) {
      case 'join':
        if (me) {
          color = Colors.success;
          timestamp = false;
          parsedEvent = <span>Welcome to #{event.channel}!</span>;
        } else {
          parsedEvent = <span><b>{event.username}</b> has joined #{event.channel}</span>;
        }
        break;

      case 'leave':
        parsedEvent = <span><b>{event.username}</b> has left #{event.channel}</span>;
        break;

      case 'quit':
        parsedEvent = <span>{event.username} has disconnected</span>;
        break;

      case 'message':
        color = Colors.primaryText;
        parsedEvent = (
          <div style={{ float: 'left' }}>
            <b style={{ float: 'left', marginRight: 5 }}>{event.username}:</b>
            <Message text={event.message} />
          </div>
        );
        break;

      case 'reconnecting':
        color = Colors.error;
        parsedEvent = <span>Reconnecting...</span>;
        break;

      case 'reconnect failed':
        color = Colors.error;
        parsedEvent = (
          <span>
            <span>Reconnection failed. </span>
            <a
              href="#"
              onClick={() => primus.socket.open()}
              style={{ color: Colors.error }}
            >
              <b>Click here</b>
            </a>
            <span> to try again</span>
          </span>
        );
        break;

      case 'error':
        color = Colors.error;
        parsedEvent = <span>Error: {event.message}</span>;
        break;

      case 'connected':
        color = Colors.success;
        parsedEvent = <span>Connected!</span>;
        break;

      default:
        parsedEvent = <span>Unknown Event</span>;
        break;
    }

    const styles = getStyles({
      style,
      color,
    });

    return event.silent
      ? null
      : (
        <div style={styles.outer}>
          <div style={styles.event}>
            {timestamp && (
              <div style={{ float: 'left', marginRight: 5 }}>
                [{moment(event.timestamp).format('HH:mm')}]{' '}
              </div>
            )}
            {parsedEvent}
          </div>
        </div>
      );
  }
}

function mapStateToProps(state) {
  return {
    login: state.login,
    primus: state.primus,
  };
}

export default connect(mapStateToProps)(ChannelEvent);
