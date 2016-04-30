import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { joinChannel } from '~/redux/chat';

const DELIMITER = String.fromCharCode('\u0008');
const styles = {
  images: {

  },
};

class Message extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    style: PropTypes.object,
    text: PropTypes.string.isRequired,
  };

  /*eslint-disable */
  regex = {
    channels: /(#[\w\-\d]+)/,
    images: /\.(gif|jpg|jpeg|tiff|png)/,
    url: /\(?(?:(http|https|ftp):\/\/)?(?:((?:[^\W\s]|\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|localhost(?=\/)|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(\d*))?([\/]?[^\s\?]*[\/]{1})*(?:\/?([^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?([\.]{1}[^\s\?\#]*)?)?(?:\?{1}([^\s\n\#\[\]]*))?([\#][^\s\n]*)?\)?/
  };
  /*eslint-enable */

  constructor(props) {
    super(props);

    this.state = {
      regex: {
        channels: new RegExp(this.regex.channels, 'gi'),
        images: new RegExp('', 'igm'),
        url: new RegExp(this.regex.url, 'igm'),
      },
    };
  }

  parseAnchors() {
    const { dispatch, style, text } = this.props;
    const { regex } = this.state;

    return text
    .replace(regex.url, (url) => DELIMITER + url + DELIMITER)
    .replace(regex.channels, (channel) => DELIMITER + channel + DELIMITER)
    .split(DELIMITER)
    .map((t, i) => {
      let content = t;
      let key = `m-${i}`;

      if (regex.url.test(content)) {
        if (
          content.substr(0, 7) !== 'http://'
          && content.substr(0, 8) !== 'https://'
        ) {
          content = `http://${content}`;
        }

        return (
          <a
            key={key}
            href={content}
            style={style}
            target="_blank"
          >
            {content}
          </a>
        );
      }

      if (regex.channels.test(content)) {
        return (
          <a
            key={key}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              dispatch(joinChannel(content.replace('#', '')));
            }}
            style={style}
          >
            {content}
          </a>
        );
      }

      return <span key={key}>{t}</span>;
    });
  }

  render() {
    return <span>{this.parseAnchors()}</span>;
  }
}

export default connect()(Message);
