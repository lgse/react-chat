import React, { PropTypes } from 'react';
import Colors from '~/theme/Colors';

const getStyles = ({
    focused,
    icon,
    iconWrapperStyle,
    inputStyle,
    style,
  }) => (
  {
    outer: Object.assign({
      background: Colors.white,
      borderRadius: 2,
      borderColor: focused ? Colors.accent : Colors.fieldBorderColor,
      borderStyle: 'solid',
      borderWidth: '1px',
      color: Colors.primaryText,
      float: 'left',
      height: 50,
      position: 'relative',
      width: '100%',
    }, style),

    iconWrapper: Object.assign({
      float: 'left',
      height: 50,
      lineHeight: '50px',
      textAlign: 'center',
      width: 50,
    }, iconWrapperStyle),

    input: Object.assign({
      background: 'transparent',
      border: 0,
      color: 'inherit',
      float: 'right',
      fontSize: 16,
      height: 'calc(100%)',
      margin: 0,
      padding: 0,
      WebkitAppearance: 'none',
      width: (icon) ? 'calc(100% - 50px)' : '100%',
    }, inputStyle),
  }
);

class TextField extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    focused: PropTypes.bool,
    fieldType: PropTypes.string,
    icon: PropTypes.object,
    iconWrapperStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
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
    fieldType: 'text',
    icon: null,
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
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
      disabled,
      fieldType,
      icon,
      iconWrapperStyle,
      inputStyle,
      onBlur,
      onChange,
      onFocus,
      onKeyDown,
      placeholder,
      style,
      tabIndex,
      value,
      ...other,
    } = this.props;

    const styles = getStyles({
      focused: this.state.focused,
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
        <input
          autoFocus={this.state.focused}
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
          onFocus={(e) => {
            this.setState({ focused: true });
            onFocus(e);
          }}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          style={styles.input}
          tabIndex={tabIndex}
          type={fieldType}
          value={value || this.state.value}
        />
      </div>
    );
  }
}

export default TextField;
