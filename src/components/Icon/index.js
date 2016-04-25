import React, { PropTypes } from 'react';
import classnames from 'classnames';

const getStyles = (size, styles) => Object.assign({
  color: 'inherit',
  display: 'inline-block',
  fontSize: size,
  position: 'relative',
}, styles);

class Icon extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    size: PropTypes.number,
    style: PropTypes.object,
    zmdi: PropTypes.string,
  };

  static defaultProps = {
    className: 'icon',
    size: 16,
    zmdi: null,
  };

  render() {
    const {
      className,
      size,
      style,
      zmdi,
      ...other,
    } = this.props;

    const classes = classnames(className, {
      zmdi: zmdi !== null,
      [`zmdi-${zmdi}`]: zmdi !== null,
    });

    return (
      <i
        className={classes}
        style={getStyles(size, style)}
        {...other}
      />
    );
  }
}

export default Icon;
