import React, { PropTypes } from 'react';
import Button from '~/components/Button';
import Colors from '~/theme/Colors';
import Icon from '~/components/Icon';
import { connect } from 'react-redux';
import { leaveChannel } from '~/redux/chat';

const getStyles = (resolution) => ({
  outer: {
    background: Colors.lightPrimary,
    display: 'table',
    height: 64,
    float: 'left',
    position: 'relative',
    width: '100%',
  },
  inner: {
    display: 'table-cell',
    height: 24,
    padding: (resolution.mobile) ? '0 20px' : '0 20px 0 260px',
    verticalAlign: 'middle',
  },
  channel: {
    color: Colors.primaryText,
    textTransform: 'uppercase',
  },
  userCount: {
    color: Colors.secondaryText,
  },
  button: {
    background: 'transparent',
    boxShadow: 'none',
    height: 24,
    marginTop: -12,
    position: 'absolute',
    top: '50%',
    right: 20,
    width: 24,
  },
  buttonIcon: {
    color: Colors.secondaryText,
    fontSize: 24,
  },
});

class Header extends React.Component {
  static propTypes = {
    chat: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
  };

  closeChannel = (e) => {
    const { chat, dispatch } = this.props;
    e.preventDefault();

    dispatch(leaveChannel(chat.activeChannel));
  };

  render() {
    const { chat, navigation } = this.props;
    const { activeChannel, channels } = chat;
    const { idle, users } = channels[activeChannel];
    const { resolution } = navigation;
    const styles = getStyles(resolution);
    const userCount = users.length;

    return (
      <div style={styles.outer}>
        <div style={styles.inner}>
          <h3 style={styles.channel}>
            <span>{`#${chat.activeChannel}`}</span>
          </h3>
          <h4 style={styles.userCount}>
            <span>{userCount} {!userCount || userCount > 1 ? 'users' : 'user'}</span>
            {!idle && (
              <Button
                label={<Icon
                  onClick={this.closeChannel}
                  style={styles.buttonIcon}
                  zmdi="close"
                />}
                style={styles.button}
                />
            )}
          </h4>
        </div>
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

export default connect(mapStateToProps)(Header);
