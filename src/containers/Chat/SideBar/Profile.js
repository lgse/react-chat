import React, { PropTypes } from 'react';
import Button from '~/components/Button';
import Colors from '~/theme/Colors';
import FloatingMenu from '~/components/FloatingMenu';
import Icon from '~/components/Icon';
import Indicator from '~/components/Indicator';
import MenuItem from '~/components/MenuItem';
import { connect } from 'react-redux';
import { requestLogout } from '~/redux/login';

const styles = {
  outer: {
    background: Colors.darkPrimary,
    float: 'left',
    width: '100%',
  },
  circle: {
    background: Colors.darkPrimary,
    color: Colors.white,
    float: 'left',
    fontSize: 24,
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  infoOuter: {
    display: 'table',
    float: 'left',
    height: 64,
    overflow: 'hidden',
    width: 'calc(100% - 60px)',
  },
  infoInner: {
    display: 'table-cell',
    paddingLeft: 20,
    textAlign: 'left',
    verticalAlign: 'middle',
  },
  username: {
    color: Colors.white,
    fontSize: 14,
    display: 'block',
    textTransform: 'uppercase',
  },
  indicator: {
    lineHeight: '20px',
  },
  moreMenu: {
    height: 24,
    position: 'absolute',
    right: 20,
    top: 20,
    width: 24,
  },
  moreMenuItemIcon: {
    color: Colors.secondaryText,
    top: 2,
  },
};

class Profile extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    login: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    primus: PropTypes.object.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  logout = () => {
    const { dispatch } = this.props;

    dispatch(requestLogout(() => {
      this.context.router.push('/login');
    }));
  };

  render() {
    const { login, primus, navigation } = this.props;
    const { connected } = primus;
    const { resolution } = navigation;
    const { username } = login;

    return (
      <div style={styles.outer}>
        <div style={styles.infoOuter}>
          <div style={styles.infoInner}>
            <span style={styles.username}>{username}</span>
            <Indicator
              enabled={connected}
              label={connected ? 'Connected' : 'Disconnected'}
              style={styles.indicator}
              />
          </div>
        </div>
        <FloatingMenu
          originX={resolution.mobile ? 'right' : 'left'}
          togglerLabel={<Icon
            size={24}
            zmdi="more-vert"
          />}
          style={styles.moreMenu}
          >
          <MenuItem
            icon={<Icon
              size={18}
              style={styles.moreMenuItemIcon}
              zmdi="lock"
            />}
            label="Logout"
            onClick={this.logout}
            />
        </FloatingMenu>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    login: state.login,
    navigation: state.navigation,
    primus: state.primus,
  };
}

export default connect(mapStateToProps)(Profile);
