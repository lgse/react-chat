import React, { PropTypes } from 'react';
import ChannelList from './ChannelList';
import Colors from '~/theme/Colors';
import Profile from './Profile';

const getStyles = (docked) => (
  {
    outer: {
      background: Colors.primary,
      height: '100%',
      left: 0,
      position: 'absolute',
      top: 0,
      transition: 'transform 500ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
      transform: (docked) ? 'translateX(-220px)' : 'translateX(0)',
      width: 240,
      zIndex: 1,
    },
    inner: {
      position: 'relative',
    },
  }
);

class SideBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = { docked: true };
  }

  componentDidMount() {
    this.toggleDocked();
  }

  toggleDocked = () => {
    this.setState({ docked: !this.state.docked });
  };

  render() {
    const styles = getStyles(this.state.docked);

    return (
      <div style={styles.outer}>
        <div className="clearfix" style={styles.inner}>
          <Profile />
          <ChannelList />
        </div>
      </div>
    );
  }
}

export default SideBar;
