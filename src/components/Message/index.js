import React, { PropTypes } from 'react';
import Colors from '~/theme/Colors';
import { connect } from 'react-redux';
import { joinChannel } from '~/redux/chat';

class Message extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
  };

  /*eslint-disable */
  regex = {
    breaks: /(?:\r\n|\r|\n)/,
    channels: /(#[\w\-\d]+)/,
    images: /\.(gif|jpg|jpeg|tiff|png)/,
    url: /\(?(?:(http|https|ftp):\/\/)?(?:((?:[^\W\s]|\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|localhost(?=\/)|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(\d*))?([\/]?[^\s\?]*[\/]{1})*(?:\/?([^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?([\.]{1}[^\s\?\#]*)?)?(?:\?{1}([^\s\n\#\[\]]*))?([\#][^\s\n]*)?\)?/
  };
  /*eslint-enable */

  constructor(props) {
    super(props);

    this.images = [];
    this.state = {
      regex: {
        breaks: new RegExp(this.regex.breaks, 'g'),
        channels: new RegExp(this.regex.channels, 'gi'),
        images: new RegExp(this.regex.images, 'gi'),
        url: new RegExp(this.regex.url, 'gim'),
      },
    };
  }

  parseMessage() {
    const DELIMITER = String.fromCharCode('\u0008');
    const { dispatch, text } = this.props;
    const { regex } = this.state;

    return text
    .replace(regex.breaks, (br) => DELIMITER + br + DELIMITER)
    .replace(regex.url, (url) => DELIMITER + url + DELIMITER)
    .replace(regex.channels, (channel) => DELIMITER + channel + DELIMITER)
    .split(DELIMITER)
    .map((t, i) => {
      let content = t;
      let key = `m-${i}`;
      let href = t;

      if (regex.url.test(content)) {
        if (
          href.substr(0, 7) !== 'http://'
          && href.substr(0, 8) !== 'https://'
        ) {
          href = `http://${content}`;
        }

        if (regex.images.test(href)) {
          this.images.push(<img
            key={key}
            src={href}
            style={{ float: 'left', maxHeight: 200, maxWidth: 200 }}
          />
          );
        }

        return (
          <a
            key={key}
            href={href}
            style={{ color: Colors.accent }}
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
            style={{ color: Colors.accent }}
          >
            {content}
          </a>
        );
      }

      if (regex.breaks.test(content)) {
        return <br key={key} />;
      }

      return <span key={key}>{t}</span>;
    });
  }

  render() {
    return (
      <div style={{ float: 'left', margin: 0 }}>
        <pre style={{ clear: 'both', float: 'left', margin: 0 }}>{this.parseMessage()}</pre>
        {this.images.length
          ? <div style={{ clear: 'both', float: 'left', paddingTop: 10 }}>{this.images}</div>
          : null
        }
      </div>
    );
  }
}

export default connect()(Message);
