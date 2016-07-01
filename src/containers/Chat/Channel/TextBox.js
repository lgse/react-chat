import React, { PropTypes } from 'react';
import Colors from '~/theme/Colors';
import { connect } from 'react-redux';
import { sendMessage } from '~/redux/chat';

const getStyles = (resolution) => ({
  outer: {
    background: Colors.white,
    borderTop: '1px solid #EEE',
    bottom: 0,
    clear: 'both',
    float: 'left',
    height: (resolution.mobile) ? 64 : 100,
    left: 0,
    position: 'fixed',
    width: '100%',
    zIndex: (resolution.mobile) ? 2 : 0,
  },
  inner: {
    padding: (resolution.mobile) ? 0 : '0 0 0 240px',
  },
  textarea: {
    border: 0,
    color: Colors.primaryText,
    float: 'left',
    fontSize: 16,
    height: (resolution.mobile) ? 64 : 100,
    padding: 20,
    resize: 'none',
    width: '100%',
  },
});

export class TextBox extends React.Component {
  static propTypes = {
    chat: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = { value: '' };
    this.ctrlDown = false;
  }

  handleSubmit = () => {
    const { chat, dispatch } = this.props;

    if (this.state.value.trim() && !chat.pendingMessage) {
      dispatch(sendMessage(this.state.value, () => this.setState({ value: '' })));
    }
  };

  render() {
    const { resolution } = this.props.navigation;
    const styles = getStyles(resolution);

    return (
      <div style={styles.outer}>
        <div className="clearfix" style={styles.inner}>
          <form onSubmit={this.handleSubmit}>
            <textarea
              onChange={(e) => this.setState({ value: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Control') {
                  this.ctrlDown = true;
                }

                if (e.key === 'Enter' && !this.ctrlDown) {
                  this.handleSubmit();
                } else if (e.key === 'Enter' && this.ctrlDown) {
                  this.setState({ value: `${e.target.value}\r\n` });
                }
              }}
              onKeyUp={(e) => {
                if (e.key === 'Control') {
                  this.ctrlDown = false;
                }
              }}
              placeholder="Type a message and hit Enter..."
              style={styles.textarea}
              type="text"
              value={this.state.value}
            />
          </form>
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

export default connect(mapStateToProps)(TextBox);
