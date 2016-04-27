import React, { PropTypes } from 'react';
import Button from '~/components/Button';
import DropDown from '~/components/DropDown';
import FormSubmit from '~/components/FormSubmit';
import Icon from '~/components/Icon';
import TextField from '~/components/TextField';
import { Colors } from '~/theme';
import { connect } from 'react-redux';
import { initializeSocket } from '~/redux/primus';
import { requestLogin, loginError, loginReset } from '~/redux/login';

const getStyles = (resolution) => ({
  outer: {
    background: Colors.darkPrimary,
    display: 'table',
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  inner: {
    display: 'table-cell',
    textAlign: 'center',
    verticalAlign: 'middle',
  },
  form: {
    margin: '0 auto',
    padding: 30,
    width: (resolution.mobile) ? '100%' : 420,
  },
  header: {
    clear: 'both',
    color: Colors.white,
    float: 'left',
    fontSize: 30,
    fontWeight: 400,
    lineHeight: '30px',
    marginBottom: 50,
    width: '100%',
  },
  button: {
    clear: 'both',
    float: 'left',
  },
  field: {
    background: Colors.white,
    marginBottom: 20,
  },
  fieldIcon: {
    color: Colors.secondaryText,
    top: 7,
  },
  errorOuter: {
    clear: 'both',
    display: 'table',
    float: 'left',
    height: 50,
    width: '100%',
  },
  errorInner: {
    color: Colors.white,
    display: 'table-cell',
    verticalAlign: 'middle',
    textAlign: 'center',
  },
});

class Login extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    login: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    primus: PropTypes.object.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    document.body.style.background = Colors.darkPrimary;

    this.state = {
      server: '',
      username: '',
      protocol: 'wss',
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.login();
  };

  login = () => {
    const { dispatch, login, primus } = this.props;
    const { protocol, server, username } = this.state;

    if (!primus.connecting) {
      if (login.error && !login.requesting) {
        dispatch(loginReset());
      }

      new Promise((resolve) => {
        if (!server) {
          throw new Error('Server field cannot be empty.');
        } else if (!username) {
          throw new Error('Username field cannot be empty.');
        } else if (!primus.connected) {
          dispatch(initializeSocket(`${protocol}://${server}`, resolve));
        } else {
          resolve();
        }
      })
      .then(() => {
        if (!login.requesting) {
          dispatch(requestLogin(username, (err) => {
            if (!err) {
              this.context.router.push('/chat');
            }
          }));
        }
      })
      .catch((e) => dispatch(loginError(e.message)));
    }
  };

  render() {
    const { login, primus, navigation } = this.props;
    const error = login.error || primus.error;
    const styles = getStyles(navigation.resolution);

    return (
      <div style={styles.outer}>
        <div style={styles.inner}>
          <form
            className="clearfix"
            onSubmit={this.handleSubmit}
            style={styles.form}
          >
            <h1 style={styles.header}>Sign In</h1>
            <TextField
              focused
              icon={<Icon
                zmdi="account"
                size={24}
                style={styles.fieldIcon}
              />}
              onChange={(username) => this.setState({ username })}
              placeholder="Username"
              style={styles.field}
              value={this.state.username}
            />
            <TextField
              icon={<Icon
                zmdi="device-hub"
                size={24}
                style={styles.fieldIcon}
              />}
              onChange={(server) => this.setState({ server })}
              placeholder="Server Address"
              style={styles.field}
              value={this.state.server}
            />
            <DropDown
              icon={<Icon
                zmdi="lock"
                size={24}
                style={styles.fieldIcon}
              />}
              onChange={(protocol) => this.setState({ protocol })}
              value={this.state.protocol}
            >
              <option value="wss">SSL / TLS</option>
              <option value="ws">No Encryption</option>
            </DropDown>
            <div style={styles.errorOuter}>
              <div style={styles.errorInner}>
                {error && <span>{error}</span>}
              </div>
            </div>
            <Button
              disabled={primus.connecting}
              label={primus.connecting ? 'Connecting...' : 'Start Chatting'}
              onClick={this.login}
              style={styles.button}
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
    login: state.login,
    navigation: state.navigation,
    primus: state.primus,
  };
}

export default connect(mapStateToProps)(Login);
