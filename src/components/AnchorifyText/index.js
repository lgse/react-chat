import React, { PropTypes } from 'react';

const DELIMITER = String.fromCharCode('\u0008');

class AnchorifyText extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
      PropTypes.string,
    ]),
    flags: PropTypes.string,
    regex: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
    style: PropTypes.object,
    target: PropTypes.string,
    text: PropTypes.string.isRequired,
  };

  /*eslint-disable */
  static defaultProps = {
    regex: /\(?(?:(http|https|ftp):\/\/)?(?:((?:[^\W\s]|\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|localhost(?=\/)|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(\d*))?([\/]?[^\s\?]*[\/]{1})*(?:\/?([^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?([\.]{1}[^\s\?\#]*)?)?(?:\?{1}([^\s\n\#\[\]]*))?([\#][^\s\n]*)?\)?/,
    flags: 'igm',
    style: {},
    target: '_blank',
  };
  /*eslint-enable */

  constructor(props) {
    super(props);

    let regex;

    if (props.flags) {
      regex = new RegExp(props.regex, props.flags);
    } else {
      regex = new RegExp(props.regex);
    }

    this.state = { regex };
  }

  anchorify(text) {
    const { children, style, target } = this.props;
    const { regex } = this.state;

    return text
    .replace(regex, (url) => DELIMITER + url + DELIMITER)
    .split(DELIMITER)
    .map((t, i) => {
      let url = t;
      let key = `anchorify-text-${i}`;

      if (regex.test(url)) {
        if (React.Children.count(children) === 1) {
          return React.cloneElement(children, { url, key });
        }

        if (
          url.substr(0, 7) !== 'http://'
          && url.substr(0, 8) !== 'https://'
        ) {
          url = `http://${url}`;
        }

        return (
          <a
            key={key}
            href={url}
            style={style}
            target={target}
          >
            {t}
          </a>
        );
      }

      return <span key={key}>{t}</span>;
    });
  }

  render() {
    let content = this.anchorify(this.props.text);

    return (
      <span>{content}</span>
    );
  }
}

export default AnchorifyText;
