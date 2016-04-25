import React, { PropTypes } from 'react';
import Button from '~/components/Button';
import Colors from '~/theme/Colors';
import Circle from '~/components/Circle';
import FormSubmit from '~/components/FormSubmit';
import Icon from '~/components/Icon';
import Indicator from '~/components/Indicator';
import TextField from '~/components/TextField';
import { connect } from 'react-redux';
import { switchChannel, joinChannel } from '~/redux/chat';

const styles = {
  outer: {
    float: 'left',
    marginBottom: 20,
    padding: 20,
    position: 'relative',
    width: '100%',
  },
  header: {
    clear: 'both',
    color: Colors.white,
    float: 'left',
    lineHeight: '20px',
    marginBottom: 20,
  },
  list: {
    clear: 'both',
    float: 'left',
    width: '100%',
  },
  channel: {
    height: 36,
    marginLeft: -20,
    maxWidth: 'calc(100% + 40px)',
    position: 'relative',
    width: 'calc(100% + 40px)',
  },
  channelButton: {
    background: Colors.primary,
    color: Colors.white,
    boxShadow: 'none',
    height: 36,
    padding: '0 60px 0 30px',
  },
  channelLabel: {
    fontSize: 14,
    fontWeight: 400,
    textAlign: 'left',
  },
  channelIndicatorOuter: {
    height: 6,
    position: 'absolute',
    right: 27,
    top: 15,
    width: 6,
  },
  channelIndicatorInner: {
    float: 'left',
    top: 'auto',
  },
  button: {
    background: 'white',
    boxShadow: 'none',
    color: Colors.secondaryText,
    height: 20,
    position: 'absolute',
    right: 20,
    top: 20,
    width: 20,
  },
  buttonIcon: {
    top: 2,
  },
  addChannel: {
    clear: 'both',
    float: 'left',
    height: 36,
    marginLeft: -20,
    padding: '0 30px',
    width: 'calc(100% + 40px)',
  },
  textField: {
    background: 'transparent',
    borderWidth: 0,
    color: Colors.white,
    height: 36,
  },
};

class ChannelList extends React.Component {
  static propTypes = {
    chat: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      addChannelMode: false,
      override: false,
      value: '#',
    };
  }

  handleBlur = (e = null) => {
    const { button } = this.refs.button.refs;

    this.setState({
      addChannelMode: false,
      override: e && e.relatedTarget === button,
    });
  };

  handleChange = (value) => {
    let newVal = value;

    if (newVal.charAt(1) === '#' && newVal.length === 2) {
      newVal = `#${newVal.replace('#', '')}`;
    }

    if (newVal.charAt(0) !== '#') {
      newVal = `#${newVal}`;
    }

    this.setState({ value: newVal });
  };

  handleChannelSubmit = (e) => {
    const { value } = this.state;
    e.preventDefault();

    if (value.length > 1 && value !== '#') {
      this.addChannel();
    }
  };

  addChannel = () => {
    const { chat, dispatch } = this.props;
    const { value } = this.state;

    if (!chat.channels[value]) {
      dispatch(joinChannel(value.substring(1, value.length)));
      this.setState({
        addChannelMode: false,
        value: '#',
      });
    }
  };

  switchChannel = (channel) => {
    const { chat, dispatch } = this.props;

    if (chat.activeChannel !== channel) {
      dispatch(joinChannel(channel));
      this.handleBlur();
    }
  };

  render() {
    const { activeChannel, channels } = this.props.chat;
    const { addChannelMode, value } = this.state;
    const channelList = Object.keys(channels).sort().map((channel) => (
      <div style={styles.channel}>
        <Button
          active={activeChannel === channel}
          activeStyle={{ background: Colors.accent }}
          label={`#${channel}`}
          labelStyle={styles.channelLabel}
          onClick={(e) => this.switchChannel(channel)}
          style={styles.channelButton}
        />
        {!channels[channel].viewed && (
          <Indicator
            enabled
            enabledColor={Colors.white}
            indicatorStyle={styles.channelIndicatorInner}
            style={styles.channelIndicatorOuter}
          />
        )}
      </div>
    ));

    return (
      <div style={styles.outer}>
        <h3 style={styles.header}>Channels ({Object.keys(channels).length})</h3>
        <Button
          active={addChannelMode}
          activeStyle={{ color: Colors.primaryText }}
          label={<Icon
            style={styles.buttonIcon}
            zmdi={addChannelMode ? 'minus' : 'plus'}
          />}
          hoverStyle={{ color: Colors.primaryText }}
          onClick={() => {
            const { override } = this.state;

            this.setState({
              addChannelMode: !this.state.addChannelMode && !override,
              override: false,
            });
          }}
          ref="button"
          style={styles.button}
        />
        {addChannelMode && (
          <div style={styles.addChannel}>
            <form onSubmit={this.handleChannelSubmit}>
              <TextField
                focused
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                style={styles.textField}
                value={value}
              />
              <FormSubmit />
            </form>
          </div>
        )}
        <div children={channelList} style={styles.list} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    chat: state.chat,
  };
}

export default connect(mapStateToProps)(ChannelList);
