import React, { PropTypes } from 'react';
import Colors from '~/theme/Colors';

const getStyles = ({
    innerStyle,
    style,
    zIndex,
  }) => {
  let boxShadow = '';

  switch (zIndex) {
    default:
    case 1:
      boxShadow = '0 1px 5px rgba(0,0,0,0.1)';
      break;

    case 2:
      boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      break;

    case 3:
      boxShadow = '0 3px 11px rgba(0,0,0,0.2)';
      break;

    case 4:
      boxShadow = '0 4px 14px rgba(0,0,0,0.3)';
      break;
  }

  return Object.assign({
    background: Colors.white,
    borderRadius: 2,
    boxShadow,
    position: 'relative',
  }, style);
};

class Paper extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
      PropTypes.string,
    ]),
    className: PropTypes.string,
    innerStyle: PropTypes.object,
    size: PropTypes.string,
    style: PropTypes.object,
    zIndex: PropTypes.number,
  };

  static defaultProps = {
    zIndex: 1,
  };

  render() {
    const {
      children,
      innerStyle,
      style,
      zIndex,
      ...other,
    } = this.props;

    const styles = getStyles({
      innerStyle,
      style,
      zIndex,
    });

    return (
      <div
        children={children}
        style={styles}
        {...other}
      />
    );
  }
}

export default Paper;
