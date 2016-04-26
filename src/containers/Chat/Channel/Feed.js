import React, { PropTypes } from 'react';
import Event from '~/components/Event';
import Colors from '~/theme/Colors';
import { connect } from 'react-redux';

const getStyles = (resolution) => ({
  outer: {
    background: '#FFF',
    float: 'left',
    height: (resolution.mobile) ? 'calc(100% - 64px)' : 'calc(100% - 164px)',
    paddingTop: (resolution.mobile) ? 64 : 0,
    overflow: 'auto',
    width: '100%',
    WebkitOverflowScrolling: 'touch',
  },
  inner: {
    padding: (resolution.mobile) ? 20 : '20px 20px 20px 260px',
  },
});

export class Feed extends React.Component {
  static propTypes = {
    chat: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
  };

  componentDidUpdate() {
    const { outer } = this.refs;
    outer.scrollTop = outer.scrollHeight;
  }

  render() {
    const { chat, navigation } = this.props;
    const { activeChannel, channels } = chat;
    const { events } = channels[activeChannel];
    const { resolution } = navigation;
    const styles = getStyles(resolution);
    const eventList = events.map((event, index) => (
      <Event
        event={event}
        key={index}
        />
    ));

    return (
      <div style={styles.outer} ref="outer">
        <div
          children={eventList}
          style={styles.inner}
        />
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

export default connect(mapStateToProps)(Feed);
