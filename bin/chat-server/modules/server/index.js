var ChatClient = require('../client');
var Publisher = require('../publisher');
var Primus = require('primus');
var PrimusResponder = require('primus-responder');
var redis = require('redis');
var uuid = require('node-uuid');
var _ = require('lodash');

var ChatServer = function(config) {
  this.config = config;
  this.channels = {};
  this.users = {};
  this.pub = new Publisher(config);
  this.primus = new Primus.createServer(config.primus);
  this.primus.use('responder', PrimusResponder);
  this.listen();
};

ChatServer.prototype ={
  protocol: "0.1.0",

  listen: function () {
    var self = this;

    this.primus.on('connection', function (spark) {
      var client = new ChatClient(spark, redis.createClient(_.omit(self.config.redis, 'channel')), self);

      spark.on('end', function () {
        client.destroy();
      });
    });

    console.log(`Chat server listening on port: ${this.config.primus.port}`);
  },

  addUser: function(username) {
    if (this.users[username]) {
      throw "Username already in use.";
    }

    this.users[username] = 1;
  },

  removeUser: function(username) {
    this.users = _.omit(this.users, username);
  },

  channelEvent: function(action, channel, username) {
    if (!this.channels[channel]) {
      this.channels[channel] = [];
    }

    switch (action) {
      case 'join':
        this.channels[channel].push(username);
      break;

      case 'leave':
        this.channels[channel] = _.without(this.channels[channel], username);
      break;
    }

    this.pub.dispatch(action, {
      type: action,
      channel: channel,
      username: username,
      users: this.channels[channel],
    });
  }
};

module.exports = ChatServer;