import React, { PropTypes } from 'react';
import { Colors } from '~/theme';

const getStyles = ({
    disabledColor,
    enabled,
    enabledColor,
    indicatorStyle,
    label,
    labelStyle,
    style,
  }) => (
  {
    outer: Object.assign({
      float: 'left',
    }, style),

    indicator: Object.assign({
      background: (enabled)
        ? enabledColor || Colors.success
        : disabledColor || Colors.error,
      borderRadius: '50%',
      display: 'inline-block',
      height: 6,
      position: 'relative',
      top: (label) ? -1 : 0,
      width: 6,
    }, indicatorStyle),

    label: Object.assign({
      color: 'rgba(255,255,255,0.75)',
      display: 'inline-block',
      fontSize: 11,
      marginLeft: 6,
    }, labelStyle),
  }
);

class Indicator extends React.Component {
  static propTypes = {
    disabledColor: PropTypes.string,
    enabled: PropTypes.bool.isRequired,
    enabledColor: PropTypes.string,
    indicatorStyle: PropTypes.object,
    label: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
    labelStyle: PropTypes.object,
    style: PropTypes.object,
  };

  static defaultProps = {
    disabledColor: null,
    enabledColor: null,
    label: null,
  };

  render() {
    const {
      disabledColor,
      enabled,
      enabledColor,
      indicatorStyle,
      label,
      labelStyle,
      style,
      ...other,
    } = this.props;

    const styles = getStyles({
      disabledColor,
      enabled,
      enabledColor,
      label,
      indicatorStyle,
      labelStyle,
      style,
    });

    return (
      <div style={styles.outer} {...other}>
        <span style={styles.indicator} />
        {label && <span style={styles.label}>{label}</span>}
      </div>
    );
  }
}

export default Indicator;
