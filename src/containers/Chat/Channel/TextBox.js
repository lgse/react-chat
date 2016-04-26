import React, { PropTypes } from 'react';
import Colors from '~/theme/Colors';
import FormSubmit from '~/components/FormSubmit';
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
    padding: (resolution.mobile) ? '15px 20px 0' : '20px 20px 0 260px',
  },
  input: {
    border: 0,
    color: Colors.primaryText,
    float: 'left',
    fontSize: 16,
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
  }

  handleSubmit = (e) => {
    const { chat, dispatch } = this.props;
    e.preventDefault();

    if (this.state.value && !chat.pendingMessage) {
      dispatch(sendMessage(this.state.value, (err) => {
        if (!err) {
          this.setState({ value: '' });
        }
      }));
    }
  };

  render() {
    const { resolution } = this.props.navigation;
    const styles = getStyles(resolution);

    return (
      <div style={styles.outer}>
        <div className="clearfix" style={styles.inner}>
          <form onSubmit={this.handleSubmit}>
            <input
              onChange={(e) => this.setState({ value: e.target.value })}
              placeholder="Type a message and hit Enter..."
              style={styles.input}
              type="text"
              value={this.state.value}
              />
            <FormSubmit />
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
