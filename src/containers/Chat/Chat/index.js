import React, { PropTypes } from 'react';
import Channel from '../Channel';
import SideBar from '../SideBar';
import { connect } from 'react-redux';
import { initializeChat } from '~/redux/chat';

const styles = {
  height: '100%',
  position: 'fixed',
  width: '100%',
};

class Chat extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(initializeChat());
  }

  render() {
    return (
      <div style={styles}>
        <Channel />
        <SideBar />
      </div>
    );
  }
}

export default connect()(Chat);
