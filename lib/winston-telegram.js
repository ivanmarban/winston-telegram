/*
 * winston-telegram.js: Transport for outputting logs to Telegram
 *
 * (C) 2015 Ivan Marban
 * MIT LICENCE
 */

var util = require('util')
var https = require('https')
var winston = require('winston')
var format = require('sf')

/**
 * @constructs
 * @param {object} options - Options.
 * @param {string} options.token  - Telegram bot authentication token.
 * @param {string} options.chatId - Telegram unique identifier for chat.
 * @param {string} [options.level='info'] - Level of messages that this transport should log.
 * @param {boolean} [options.handleExceptions=false] - Handling Uncaught Exceptions with winston.
 * @param {boolean} [options.unique=false] - Whether to log only the declared level and none above.
 * @param {boolean} [options.silent=false] - Whether to suppress output.
 * @param {boolean} [options.disableNotification=false] - Sends the message silently.
 * @param {string} [options.name='winston-telegram'] - Logger's name.
 * @param {object} [options.template='[{level}] {message}'] - Format output message based on named arguments.
 * @param {Function} [options.formatMessage] - Format output message by own method.
 * @param {number} [options.batchingDelay=0] - Time in ms within which to batch messages together.
 * @param {string} [options.batchingSeparator='\n\n'] - String with which to join batched messages with.
 */
var Telegram = (exports.Telegram = function (options) {
  options = options || {}

  if (!options.token || !options.chatId) {
    throw new Error("winston-telegram requires 'token' and 'chatId' property")
  }

  if (options.formatMessage && typeof options.formatMessage !== 'function') {
    throw new Error(
      "winston-telegram 'formatMessage' property should be function"
    )
  }

  this.token = options.token
  this.chatId = options.chatId
  this.level = options.level || 'info'
  this.handleExceptions = options.handleExceptions || false
  this.unique = options.unique || false
  this.silent = options.silent || false
  this.disableNotification = options.disableNotification || false
  this.name = options.name || this.name
  this.template = options.template || '[{level}] {message}'
  this.formatMessage = options.formatMessage
  this.batchingDelay = options.batchingDelay || 0
  this.batchingSeparator = options.batchingSeparator || '\n\n'
  this.batchedMessages = []
  this.batchingTimeout = 0
})

/** @extends winston.Transport */
util.inherits(Telegram, winston.Transport)

/**
 * Define a getter so that `winston.transports.Telegram`
 * is available and thus backwards compatible.
 */
winston.transports.Telegram = Telegram

/**
 * Expose the name of this Transport on the prototype.
 */
Telegram.prototype.name = 'telegram'

/**
 * Core logging method exposed to Winston.
 *
 * @function log
 * @member Telegram
 * @param {string} level - Level at which to log the message.
 * @param {string} msg - Message to log.
 * @param {object} [meta] - Additional metadata to attach.
 * @param {Function} callback - Continuation to respond to when complete.
 * @returns {undefined}
 */
Telegram.prototype.log = function (level, msg, meta, callback) {
  var self = this
  if (this.silent) return callback(null, true)
  if (this.unique && this.level !== level) return callback(null, true)

  var messageText = null
  var formatOptions = { level: level, message: msg, metadata: meta }

  if (this.formatMessage) {
    messageText = this.formatMessage(formatOptions)
  } else {
    messageText = format(this.template, formatOptions)
  }

  if (this.batchingDelay) {
    this.batchedMessages.push(messageText)

    if (!this.batchingTimeout) {
      this.batchingTimeout = setTimeout(function () {
        var combinedMessages = self.batchedMessages.join(self.batchingSeparator)
        self.send(combinedMessages)

        self.batchedMessages = []
        self.batchingTimeout = 0
      }, this.batchingDelay)
    }
  } else {
    self.send(messageText)
  }

  callback(null, true)
}

/**
 * Actual method that sends the given message to Telegram.
 *
 * @function send
 * @member Telegram
 * @param {string} messageText - Formatted text to log.
 */
Telegram.prototype.send = function (messageText) {
  var self = this

  var requestData = JSON.stringify({
    chat_id: this.chatId,
    text: messageText,
    disable_notification: this.disableNotification
  })

  var options = {
    hostname: 'api.telegram.org',
    path: '/bot' + this.token + '/sendMessage',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': requestData.length
    }
  }

  self.request(options, requestData, function (error, response, body) {
    if (error) {
      self.emit('error', error)
    }
    if (response && response.statusCode !== 200) {
      self.emit(
        'error',
        response.statusCode +
          ((body && body.description && ': ' + body.description) || '')
      )
    }
    self.emit('logged')
  })
}

/**
 * Performs a https request to a server.
 *
 * @function request
 * @param {object} options - Request options.
 * @param {object} requestData - Request data.
 * @param {Function} callback - Continuation to respond to when complete.
 */
Telegram.prototype.request = function (options, requestData, callback) {
  var request = https.request(options, function (response) {
    var responseData = ''
    response.on('data', function (chunk) {
      responseData += chunk
    })
    response.on('end', function () {
      callback(null, response, JSON.parse(responseData))
    })
  })
  request.on('error', callback)
  request.write(requestData, 'utf-8')
  request.end()
}
