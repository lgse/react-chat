import React, { PropTypes } from 'react';
import Loader from '~/components/Loader';
import { connect } from 'react-redux';
import { CSS } from '~/theme';
import { windowResize } from '~/redux/navigation';
import './App.css';

export class App extends React.Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    window.addEventListener('resize', () => dispatch(windowResize()));
  }

  render() {
    const { children } = this.props;

    return <div children={children} />;
  }
}

export default connect()(App);
