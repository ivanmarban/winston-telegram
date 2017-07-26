/*
 * winston-telegram.js: Transport for outputting logs to Telegram
 *
 * (C) 2015 Ivan Marban
 * MIT LICENCE
 */

var util = require('util');
var request = require('request');
var winston = require('winston');
var format = require('sf');

/**
 * @constructs
 * @param {object} options
 * @param {String} options.token Telegram bot authentication token
 * @param {String} options.chatId Telegram unique identifier for chat
 */
var Telegram = exports.Telegram = function (options) {
  options = options || {};
  if (!options.token || !options.chatId){
    throw new Error('winston-telegram requires \'token\' and \'chatId\' property');
  }
  this.token = options.token;
  this.chatId = options.chatId;
  this.level = options.level || 'info';
  this.handleExceptions = options.handleExceptions || false;
  this.unique = options.unique || false;
  this.silent = options.silent || false;
  this.disableNotification = options.disableNotification || false;
  this.name = options.name || this.name;
  this.template = options.template || '[{level}] {message}';
  this.batchingDelay = options.batchingDelay || 0;
  this.batchingSeparator = options.batchingSeparator || "\n\n";

  this.batchedMessages = [];
  this.batchingTimeout = 0;
};

/** @extends winston.Transport */
util.inherits(Telegram, winston.Transport);

/**
 * Define a getter so that `winston.transports.Telegram`
 * is available and thus backwards compatible.
 */
winston.transports.Telegram = Telegram;

/**
 * Expose the name of this Transport on the prototype
 */
Telegram.prototype.name = 'telegram';

/**
 * Core logging method exposed to Winston.
 * @function log
 * @member Telegram
 * @param level {string} Level at which to log the message
 * @param msg {string} Message to log
 * @param meta {Object} **Optional** Additional metadata to attach
 * @param callback {function} Continuation to respond to when complete.
 */
Telegram.prototype.log = function (level, msg, meta, callback) {
  var self = this;
  if (this.silent) return callback(null, true);
  if (this.unique && this.level != level) return callback(null, true);

  var messageText = format(this.template,{level : level, message : msg, metadata : meta});

  if (this.batchingDelay) {
    this.batchedMessages.push(messageText);

    if (!this.batchingTimeout) {
      this.batchingTimeout = setTimeout(function() {
        var combinedMessages = self.batchedMessages.join(self.batchingSeparator);
        self.send(combinedMessages);

        self.batchedMessages = [];
        self.batchingTimeout = 0;
      }, this.batchingDelay);
    }
  }
  else {
    self.send(messageText);
  }

  callback(null, true);
};

/**
 * Actual method that sends the given message to Telegram
 * @function send
 * @member Telegram
 * @param messageText {string} Formatted text to log
 */
Telegram.prototype.send = function (messageText) {
  var self = this;

  request({
    url : 'https://api.telegram.org/bot'+this.token+'/sendMessage',
    method : 'POST',
    json : {
      chat_id : this.chatId,
      text : messageText,
      disable_notification : this.disableNotification
    }
  }, function(error, response, body){
    if (error) {
      self.emit('error', error);
    }
    if (response && response.statusCode != 200) {
      self.emit('error', response.statusCode + (body && body.description && (': ' + body.description) || ''));
    }
    self.emit('logged');
  });
}
