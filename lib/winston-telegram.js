/*
 * winston-telegram.js: Transport for outputting logs to Telegram
 *
 * (C) 2015 Ivan Marban
 * MIT LICENCE
 */

const request = require('request');
const format = require('sf');
const Transport = require('winston-transport');

/**
 * @constructs
 * @param {object} options
 * @param {String} options.token Telegram bot authentication token
 * @param {String} options.chatId Telegram unique identifier for chat
 */
module.exports = class Telegram extends Transport {
  constructor(options) {
    super(options);
    options = options || {};
    
    if (!options.token || !options.chatId){
      throw new Error('winston-telegram requires \'token\' and \'chatId\' property');
    }
    if (options.formatMessage && typeof options.formatMessage !== 'function'){
      throw new Error('winston-telegram \'formatMessage\' property should be function');
    }

    this.token = options.token;
    this.chatId = options.chatId;
    this.level = options.level || 'info';
    this.handleExceptions = options.handleExceptions || false;
    this.unique = options.unique || false;
    this.silent = options.silent || false;
    this.disableNotification = options.disableNotification || false;
    this.name = options.name || this.name || 'winston-telegram';
    this.template = options.template || '[{level}] {message}';
    this.formatMessage = options.formatMessage;
    this.batchingDelay = options.batchingDelay || 0;
    this.batchingSeparator = options.batchingSeparator || "\n\n";

    this.batchedMessages = [];
    this.batchingTimeout = 0;
  }

  /**
   * Core logging method exposed to Winston.
   * @function log
   * @param info {Object} info - TODO: add param description.
   * @param callback {function} callback - TODO: add param description.
   */
  log(info, callback) {
    let self = this;
    if (this.silent) return callback(null, true);
    if (this.unique && this.level != info.level) return callback(null, true);

    let messageText = null;
    let formatOptions = {level : info.level, message : info.message, metadata : info.metadata};

    if (this.formatMessage) {
        messageText = this.formatMessage(formatOptions)
    } else {
        messageText = format(this.template, formatOptions)
    }

    if (this.batchingDelay) {
      this.batchedMessages.push(messageText);

      if (!this.batchingTimeout) {
        this.batchingTimeout = setTimeout(function() {
          let combinedMessages = self.batchedMessages.join(self.batchingSeparator);
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
  }

  /**
   * Actual method that sends the given message to Telegram.
   * @function send
   * @param messageText {string} formatted text to log.
   */
  send(messageText) {
    let self = this;

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

}