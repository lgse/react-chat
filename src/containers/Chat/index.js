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
    navigation: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(initializeChat());
  }

  render() {
    const { resolution } = this.props.navigation;

    return (
      <div style={styles}>
        <Channel />
        <SideBar />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    navigation: state.navigation,
  };
}

export default connect(mapStateToProps)(Chat);

