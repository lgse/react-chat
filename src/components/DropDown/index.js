import React, { PropTypes } from 'react';
import Colors from '~/theme/Colors';
import Icon from '~/components/Icon';

const getStyles = ({
    arrowStyle,
    focused,
    icon,
    iconWrapperStyle,
    inputStyle,
    style,
  }) => (
  {
    outer: Object.assign({
      background: Colors.white,
      border: 0,
      borderRadius: 2,
      color: Colors.primaryText,
      cursor: 'pointer',
      float: 'left',
      height: 50,
      position: 'relative',
      width: '100%',
    }, style),

    iconWrapper: Object.assign({
      float: 'left',
      height: 50,
      left: 0,
      lineHeight: '50px',
      position: 'absolute',
      textAlign: 'center',
      top: 0,
      width: 50,
    }, iconWrapperStyle),

    select: Object.assign({
      appearance: 'none',
      background: 'transparent',
      border: 0,
      color: 'inherit',
      float: 'right',
      fontSize: 16,
      height: 'calc(100%)',
      padding: (icon) ? '0 20px 0 50px' : '0 20px 0 0',
      width: '100%',
      WebkitAppearance: 'none',
      MozAppearance: 'none',
      zIndex: 1,
    }, inputStyle),

    arrow: Object.assign({
      color: Colors.secondaryText,
      position: 'absolute',
      margin: '-12px 0 0 -12px',
      right: 20,
      top: '50%',
      zIndex: 0,
    }, arrowStyle),
  }
);

class DropDown extends React.Component {
  static propTypes = {
    arrowStyle: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.array.isRequired,
      PropTypes.object.isRequired,
    ]),
    disabled: PropTypes.bool,
    focused: PropTypes.bool,
    icon: PropTypes.object,
    iconWrapperStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
    onFocus: PropTypes.func,
    onKeyDown: PropTypes.func,
    placeholder: PropTypes.string,
    style: PropTypes.object,
    tabIndex: PropTypes.number,
    value: PropTypes.string,
  };

  static defaultProps = {
    disabled: false,
    focused: false,
    icon: null,
    onBlur: () => {},
    onChange: () => {},
    onClick: () => {},
    onFocus: () => {},
    onKeyDown: () => {},
    tabIndex: 1,
    value: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      focused: props.focused,
      value: props.value,
    };
  }

  render() {
    const {
      arrowStyle,
      children,
      disabled,
      icon,
      iconWrapperStyle,
      inputStyle,
      onBlur,
      onChange,
      onClick,
      onFocus,
      onKeyDown,
      placeholder,
      style,
      tabIndex,
      value,
      ...other,
    } = this.props;
    const { focused } = this.state;
    const styles = getStyles({
      arrowStyle,
      focused,
      icon,
      iconWrapperStyle,
      inputStyle,
      style,
    });

    return (
      <div
        style={styles.outer}
        {...other}
      >
        {icon !== null && <div children={icon} style={styles.iconWrapper} />}
        <select
          autoFocus={focused}
          children={children}
          disabled={disabled}
          onBlur={(e) => {
            this.setState({ focused: false });
            onBlur(e);
          }}
          onChange={(e) => {
            const v = e.target.value;
            this.setState({ value: v });
            onChange(v, e);
          }}
          onClick={onClick}
          onFocus={(e) => {
            this.setState({ focused: true });
            onFocus(e);
          }}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          style={styles.select}
          tabIndex={tabIndex}
          value={value || this.state.value}
        />
        <Icon
          size={24}
          style={styles.arrow}
          zmdi="chevron-down"
        />
      </div>
    );
  }
}

export default DropDown;
