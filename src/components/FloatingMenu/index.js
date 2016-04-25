import React, { PropTypes } from 'react';
import Button from '~/components/Button';
import Colors from '~/theme/Colors';
import MenuItem from '~/components/MenuItem';
import Paper from '~/components/Paper';

const getStyles = ({
    menuStyle,
    open,
    originX,
    originY,
    style,
    togglerStyle,
  }) => (
  {
    outer: Object.assign({
      float: 'left',
      height: 24,
      position: 'relative',
      width: 24,
    }, style),

    toggler: Object.assign({
      background: 'transparent',
      boxShadow: 'none',
      float: 'left',
      height: 24,
      width: 24,
    }, togglerStyle),

    menu: Object.assign({
      left: originX === 'left' ? 0 : 'auto',
      position: 'absolute',
      right: originX === 'right' ? 0 : 'auto',
      transition: 'transform 150ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
      transform: `scale(${open ? 1 : 0})`,
      transformOrigin: `${originY} ${originX}`,
      top: 24,
      width: 160,
      zIndex: 10,
    }, menuStyle),
  }
);

class FloatingMenu extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]),
    closeOnClickAway: PropTypes.bool,
    handleRequestClose: PropTypes.func,
    menuStyle: PropTypes.object,
    onClick: PropTypes.func,
    open: PropTypes.bool,
    originX: PropTypes.string,
    originY: PropTypes.string,
    style: PropTypes.object,
    togglerLabel: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
      PropTypes.string,
    ]),
    togglerStyle: PropTypes.object,
  };

  static defaultProps = {
    closeOnClickAway: true,
    handleRequestClose: null,
    open: false,
    onClick: () => {},
    originX: 'left',
    originY: 'top',
  };

  constructor(props) {
    super(props);

    this.state = { open: props.open };
    this.toggler = null;
  }

  componentWillReceiveProps(nextProps, nextState) {
    const { open } = nextState;

    if (
      this.props.open !== nextProps.open
      && nextProps.open !== open
    ) {
      this.setState({ open });
    }
  }

  componentDidUpdate() {
    this.toggleClickAwayHandler(this.state.open);
  }

  componentWillUnmount() {
    this.toggleClickAwayHandler(false);
  }

  getMenuItems = () => {
    const { children } = this.props;
    const items = [];

    if (!Array.isArray(children)) {
      items.push(children);
    }

    return items.map((item, index) => {
      if (item.type !== MenuItem) {
        throw new Error('FloatingMenu children should be instances of the MenuItem component.');
      }

      return React.cloneElement(
        item,
        {
          key: index,
          onClick: (e) => {
            this.handleClick(e);
            item.props.onClick(e);
          },
        }
      );
    });
  };

  handleClick = () => {
    this.setState({ open: !this.state.open });
  };

  handleRequestClose = (e) => {
    const { handleRequestClose, closeOnClickAway } = this.props;
    const { container } = this.refs;
    const clickedAway = e.target !== container && !container.contains(e.target);
    const isToggler = e.target === this.toggler;

    if (
      this.state.open
      && closeOnClickAway
      && clickedAway
      && !isToggler
    ) {
      this.setState({
        open: handleRequestClose ? !handleRequestClose(clickedAway) : false,
      });
    }
  };

  toggleClickAwayHandler(open) {
    if (open) {
      document.addEventListener('click', this.handleRequestClose, false);
    } else {
      document.removeEventListener('click', this.handleRequestClose, false);
    }
  }

  render() {
    const {
      menuStyle,
      originX,
      originY,
      style,
      togglerLabel,
      togglerStyle,
      ...other,
    } = this.props;
    const { open } = this.state;
    const styles = getStyles({
      menuStyle,
      open,
      originX,
      originY,
      style,
      togglerStyle,
    });
    const menuItems = this.getMenuItems();

    return (
      <div
        style={styles.outer}
        {...other}
      >
        <Button
          label={togglerLabel}
          onClick={this.handleClick}
          ref={(node) => {
            if (node) {
              this.toggler = node.refs.button;
            }
          }}
          style={styles.toggler}
        />
        <div
          ref="container"
          style={styles.menu}
        >
          <Paper
            children={menuItems}
            className="floating-menu"
            zIndex={2}
          />
        </div>
      </div>
    );
  }
}

export default FloatingMenu;
