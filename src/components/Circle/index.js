import React, { PropTypes } from 'react';

const circleSize = (size) => {
  switch (size) {
    default:
    case 'small':
      return 32;

    case 'medium':
      return 48;

    case 'large':
      return 64;

    case 'xl':
      return 72;

    case 'xxl':
      return 84;

    case 'xxxl':
      return 96;

    case 'xxxxl':
      return 120;
  }
};

const getStyles = ({ size, style, innerStyle }) => (
  {
    outer: Object.assign({
      borderRadius: '50%',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      display: 'table',
      height: size,
      position: 'relative',
      width: size,
    }, style),

    inner: Object.assign({
      display: 'table-cell',
      textAlign: 'center',
      verticalAlign: 'middle',
    }, innerStyle),
  }
);

class Circle extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    className: PropTypes.string,
    innerStyle: PropTypes.object,
    size: PropTypes.string,
    style: PropTypes.object,
  };

  static defaultProps = {
    size: 'small',
  };

  render() {
    const {
      children,
      innerStyle,
      size,
      style,
      ...other,
    } = this.props;

    const styles = getStyles({
      innerStyle,
      size: circleSize(size),
      style,
    });

    return (
      <div
        style={styles.outer}
        {...other}
      >
        <div
          children={children}
          style={styles.inner}
        />
      </div>
    );
  }
}

export default Circle;
