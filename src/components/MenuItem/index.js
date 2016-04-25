import React, { PropTypes } from 'react';
import Button from '~/components/Button';
import Colors from '~/theme/Colors';

const getStyles = ({
    icon,
    iconWrapperStyle,
    labelStyle,
    style,
  }) => (
  {
    button: Object.assign({
      background: Colors.white,
      color: Colors.secondaryText,
      float: 'left',
      height: 40,
      position: 'relative',
      width: '100%',
    }, style),

    buttonLabel: {
      textAlign: 'left',
    },

    iconWrapper: Object.assign({
      display: 'table-cell',
      height: 'calc(100%)',
      paddingLeft: 20,
      verticalAlign: 'middle',
    }, iconWrapperStyle),

    labelOuter: Object.assign({
      display: 'table',
      height: 'calc(100%)',
    }, labelStyle),

    labelInner: {
      border: 0,
      color: 'inherit',
      display: 'table-cell',
      fontSize: 12,
      paddingLeft: 20,
      verticalAlign: 'middle',
      width: (icon) ? 'calc(100% - 50px)' : '100%',
    },
  }
);

class MenuItem extends React.Component {
  static propTypes = {
    activeStyle: PropTypes.object,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    focused: PropTypes.bool,
    hoverStyle: PropTypes.object,
    icon: PropTypes.object,
    iconWrapperStyle: PropTypes.object,
    label: PropTypes.oneOfType([
      PropTypes.array.isRequired,
      PropTypes.object.isRequired,
      PropTypes.string.isRequired,
    ]),
    labelStyle: PropTypes.object,
    onClick: PropTypes.func,
    style: PropTypes.object,
  };

  static defaultProps = {
    activeStyle: null,
    disabled: false,
    focused: false,
    fieldType: 'text',
    hoverStyle: null,
    icon: null,
    onClick: () => {},
    value: '',
  };

  render() {
    const {
      activeStyle,
      disabled,
      hoverStyle,
      icon,
      iconWrapperStyle,
      label,
      labelStyle,
      onClick,
      style,
      ...other,
    } = this.props;

    const styles = getStyles({
      icon,
      iconWrapperStyle,
      labelStyle,
      style,
    });

    const buttonLabel = (
      <span>
        <span style={styles.labelOuter}>
          {icon !== null && <span children={icon} style={styles.iconWrapper} />}
          <span
            children={label}
            style={styles.labelInner}
          />
        </span>
      </span>
    );

    return (
      <Button
        activeStyle={activeStyle}
        disabled={disabled}
        hoverStyle={hoverStyle || { background: Colors.menuItemHover }}
        label={buttonLabel}
        labelStyle={styles.buttonLabel}
        onClick={onClick}
        style={styles.button}
        {...other}
      />
    );
  }
}

export default MenuItem;
