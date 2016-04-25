import React, { PropTypes } from 'react';
import './Loader.css';

class Loader extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    iconClass: PropTypes.string,
    style: PropTypes.object,
    iconStyle: PropTypes.object,
  };

  static defaultProps = {
    className: '',
  };

  render() {
    return (
      <div
        className={`loader ${this.props.className}`}
        style={this.props.style}
      >
        <i
          className={`icon loader ${this.props.iconClass}`}
          style={this.props.iconStyle}
        />
      </div>
    );
  }
}

export default Loader;
