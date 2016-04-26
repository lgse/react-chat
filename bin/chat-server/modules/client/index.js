var uuid = require('node-uuid');
var _ = require('lodash');

var ChatClient = function(spark, sub, server) {
  this.id = uuid.v4();
  this.channels = [];
  this.username = null;
  this.spark = spark;
  this.server = server;
  this.pub = server.pub;
  this.sub = sub;
  this.listen();
  this.subscribe();
};

ChatClient.prototype = {
  listen: function() {
    var self = this;

    this.spark.on('request', function (message, callback) {
      var data = message.data;
      var channel = data.channel;

      try {
        switch (message.action) {
          case 'login':
            self.login(data.username, data.idleChannel);
            break;

          case 'join-channel':
            self.joinChannel(channel);
            break;

          case 'leave-channel':
            self.leaveChannel(channel);
            break;

          case 'send-message':
            self.sendMessage(data);
            break;

          default:
            throw 'Invalid action requested.';
            break;
        }

        callback(null);
      } catch (error) {
        callback({ error });
      }
    });
  },

  subscribe: function() {
    var self = this;

    this.sub.on('message', function (channel, message) {
      message = JSON.parse(message);

      if (self.isOnChannel(message.data.channel) || message.global) {
        self.spark.write(_.merge({
          data: null,
          error: null,
        }, message));
      }
    });

    this.sub.subscribe(this.server.config.redis.channel);
  },

  destroy: function() {
    var self = this;

    // Unsubscribe from redis client
    this.sub.unsubscribe();
    this.sub.quit();

    // Remove user from connected users on server
    this.server.removeUser(this.username, this.channels);

    // Leave all channels
    this.channels.forEach(function (channel) {
      self.leaveChannel(channel, true);
    });
  },

  isOnChannel: function (channel) {
    return this.channels.indexOf(channel) !== -1;
  },

  sendMessage: function(data) {
    var channel = data.channel;
    var message = data.message;

    if (!this.isOnChannel(channel)) {
      throw "You are not in the channel: #" + channel;
    } else if (!message) {
      throw "Message cannot be empty.";
    }

    this.pub.dispatch('message', _.merge(data, {
      type: 'message',
      username: this.username,
    }));
  },

  login: function(username, idleChannel) {
    if (!username) {
      throw "Username cannot be empty.";
    } else if (username.length > 16) {
      throw "Username cannot be longer than 16 characters.";
    }

    this.server.addUser(username);
    this.username = username;
    this.joinChannel(idleChannel);
  },

  joinChannel: function(channel) {
    if (this.isOnChannel(channel)) {
      throw "Already in channel: #" + channel;
    } if (channel.length > 25) {
      throw "Channel name cannot be longer than 25 characters.";
    }

    this.channels.push(channel);
    this.server.channelEvent('join', channel, this.username);
  },

  leaveChannel: function(channel, silent) {
    if (!this.isOnChannel(channel)) {
      throw "Already left channel: #" + channel;
    }

    this.channels = _.without(this.channels, channel);
    this.server.channelEvent('leave', channel, this.username, silent);
  }
};

module.exports = ChatClient;

