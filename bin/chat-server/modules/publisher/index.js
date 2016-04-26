var redis = require('redis');
var _ = require('lodash');

var Publisher = function (config) {
  this.channel = config.redis.channel;
  this.pub = redis.createClient(_.omit(config.redis, 'channel'));
};

Publisher.prototype = {
  dispatch: function(action, data, global) {
    try {
      var payload = {
        action: action,
        data: _.merge({
          timestamp: Date.now(),
        }, data),
        global: global === true,
      };

      this.pub.publish(this.channel, JSON.stringify(payload));
    } catch (e) {
      throw "Publisher Error: Invalid data";
    }
  }
};

module.exports = Publisher;
