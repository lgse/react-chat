import React, { PropTypes } from 'react';
import Button from '~/components/Button';
import Colors from '~/theme/Colors';
import Icon from '~/components/Icon';
import { connect } from 'react-redux';
import { leaveChannel } from '~/redux/chat';
import { toggleSideBar } from '~/redux/navigation';

const styles = {
  outer: {
    background: Colors.accent,
    height: 64,
    position: 'fixed',
    textAlign: 'center',
    width: '100%',
    zIndex: 2,
  },
  button: {
    boxShadow: 'none',
    height: 64,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 64,
  },
  buttonIcon: {
    top: 2,
  },
  channelLabelOuter: {
    display: 'table',
    height: 'calc(100%)',
    margin: '0 auto',
    maxWidth: 'calc(100% - 124px)',
  },
  channelLabelInner: {
    color: Colors.white,
    display: 'table-cell',
    fontSize: 16,
    fontWeight: 600,
    textTransform: 'uppercase',
    verticalAlign: 'middle',
  },
  closeButton: {
    background: 'transparent',
    boxShadow: 'none',
    height: 64,
    position: 'absolute',
    top: 0,
    right: 0,
    width: 64,
  },
  closeButtonIcon: {
    color: Colors.white,
    fontSize: 24,
    top: 3,
  },
};

export class TopBar extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    chat: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
  };

  handleClick = () => {
    const { dispatch, navigation } = this.props;
    const { sidebarOpen } = navigation;

    dispatch(toggleSideBar(!sidebarOpen));
  };

  closeChannel = (e) => {
    const { chat, dispatch } = this.props;
    e.preventDefault();

    dispatch(leaveChannel(chat.activeChannel));
  };

  render() {
    const { activeChannel, channels } = this.props.chat;
    const { idle } = channels[activeChannel];

    return (
      <div style={styles.outer}>
        <Button
          label={<Icon
            size={24}
            style={styles.buttonIcon}
            zmdi="menu"
          />}
          onClick={this.handleClick}
          style={styles.button}
        />
        <span style={styles.channelLabelOuter}>
          <span style={styles.channelLabelInner}>#{activeChannel}</span>
        </span>
        {!idle && (
          <Button
            label={<Icon
              onClick={this.closeChannel}
              style={styles.closeButtonIcon}
              zmdi="close"
            />}
            style={styles.closeButton}
          />
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    chat: state.chat,
    navigation: state.navigation,
  };
}

export default connect(mapStateToProps)(TopBar);
