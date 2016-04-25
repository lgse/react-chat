import React, { PropTypes } from 'react';
import Button from '~/components/Button';
import Feed from '../Feed';
import Header from '../Header';
import TextBox from '../TextBox';
import Topbar from '../TopBar';
import Colors from '~/theme/Colors';
import { connect } from 'react-redux';
import { toggleSideBar } from '~/redux/navigation';

const getStyles = (resolution, open) => ({
  outer: {
    background: Colors.white,
    boxShadow: '-5px 1px 2px rgba(0, 0, 0, 0.1)',
    height: '100%',
    right: 0,
    position: 'fixed',
    transition: 'transform 150ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    transform: (resolution.mobile && open) ? 'translateX(240px)' : 'translateX(0)',
    top: 0,
    width: '100%',
    zIndex: (resolution.mobile) ? 2 : 0,
  },
  button: {
    background: 'transparent',
    boxShadow: 'none',
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 3,
  },
});

export class Channel extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
  };

  handleClickAway = () => {
    const { dispatch } = this.props;

    dispatch(toggleSideBar(false));
  };

  render() {
    const { resolution, sidebarOpen } = this.props.navigation;
    const styles = getStyles(resolution, sidebarOpen);

    return (
      <div style={styles.outer}>
        {resolution.mobile
          ? <Topbar />
          : <Header />
        }
        <Feed />
        <TextBox />
        {sidebarOpen && (
          <Button
            label=""
            onClick={this.handleClickAway}
            rippleEffect={false}
            style={styles.button}
          />
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    navigation: state.navigation,
  };
}

export default connect(mapStateToProps)(Channel);
