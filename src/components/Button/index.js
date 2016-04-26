import React, { PropTypes } from 'react';
import Colors from '~/theme/Colors';
import classnames from 'classnames';
import './Button.css';

const getStyles = ({
    active,
    activeStyle,
    disabled,
    hover,
    hoverStyle,
    innerStyle,
    labelStyle,
    style,
  }) => {
  let otherStyle = {};

  if (!disabled && hover && hoverStyle) {
    otherStyle = hoverStyle;
  }

  if (!disabled && active && activeStyle) {
    otherStyle = activeStyle;
  }

  return {
    outer: Object.assign({
      background: (disabled) ? Colors.disabledAccent : Colors.accent,
      borderRadius: 2,
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      color: Colors.white,
      display: 'block',
      float: 'left',
      height: 48,
      overflow: 'hidden',
      position: 'relative',
      width: '100%',
    }, style, otherStyle),

    wrapper: Object.assign({
      display: 'block',
      height: 'calc(100%)',
      overflow: 'hidden',
      maxWidth: '100%',
      width: '100%',
    }),

    inner: Object.assign({
      display: 'table',
      float: 'left',
      height: 'calc(100%)',
      position: 'relative',
      width: '100%',
    }, innerStyle),

    label: Object.assign({
      color: 'inherit',
      display: 'table-cell',
      fontSize: 14,
      fontWeight: 600,
      textAlign: 'center',
      verticalAlign: 'middle',
    }, labelStyle),
  };
};

class Button extends React.Component {
  static propTypes = {
    active: PropTypes.bool,
    activeStyle: PropTypes.object,
    children: PropTypes.object,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    label: PropTypes.oneOfType([
      PropTypes.object.isRequired,
      PropTypes.string.isRequired,
    ]),
    labelStyle: PropTypes.object,
    loading: PropTypes.bool,
    hoverStyle: PropTypes.object,
    innerStyle: PropTypes.object,
    onClick: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    onHover: PropTypes.func,
    rippleEffect: PropTypes.oneOf([false, 'light', 'dark']),
    rippleEffectClassname: PropTypes.string,
    style: PropTypes.object,
  };

  static defaultProps = {
    activeStyle: null,
    disabled: false,
    hoverStyle: null,
    innerStyle: null,
    labelStyle: {},
    loading: false,
    onClick: () => {},
    onHover: () => {},
    rippleEffect: 'dark',
    rippleEffectClassname: null,
    style: {},
  };

  constructor(props) {
    super(props);

    this.state = { hover: false };
  }

  render() {
    const {
      active,
      activeStyle,
      disabled,
      hoverStyle,
      innerStyle,
      label,
      labelStyle,
      onClick,
      onHover,
      rippleEffect,
      rippleEffectClassname,
      style,
      ...other,
    } = this.props;

    const { hover } = this.state;

    const styles = getStyles({
      active,
      activeStyle,
      disabled,
      hover,
      hoverStyle,
      innerStyle,
      labelStyle,
      style,
    });

    const classes = classnames({
      'button-ripple-effect': rippleEffect && !rippleEffectClassname && !disabled,
      dark: rippleEffect === 'dark' && !rippleEffectClassname,
    });

    return (
      <a
        className={classes}
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (!disabled) {
            onClick(e);
          }
          return false;
        }}
        onMouseEnter={(e) => {
          onHover(e);
          if (hoverStyle) {
            this.setState({ hover: true });
          }
        }}
        onMouseLeave={() => {
          if (hoverStyle) {
            this.setState({ hover: false });
          }
        }}
        ref="button"
        style={styles.outer}
        {...other}
      >
        <span style={styles.wrapper}>
          <span style={styles.inner}>
            <span style={styles.label}>{label}</span>
          </span>
        </span>
      </a>
    );
  }
}

export default Button;
