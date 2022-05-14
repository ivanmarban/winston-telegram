/*
 * winston-telegram.js: Transport for outputting logs to Telegram
 *
 * (C) 2015 Ivan Marban
 * MIT LICENCE
 */

const https = require('https')
const format = require('./string-format')
const Transport = require('winston-transport')
const MAX_MESSAGE_LENGTH = 4096

/**
 * @constructs
 * @param {object} options - Options.
 * @param {string} options.token - Telegram bot authentication token.
 * @param {string} options.chatId - Telegram unique identifier for chat.
 * @param {string} [options.parseMode=''] - Telegram mode for parsing entities in the message text.
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
module.exports = class Telegram extends Transport {
  constructor (options) {
    super(options)
    options = options || {}

    if (!options.token || !options.chatId) {
      throw new Error("winston-telegram requires 'token' and 'chatId' property")
    }
    if (options.formatMessage && typeof options.formatMessage !== 'function') {
      throw new Error("winston-telegram 'formatMessage' property should be function")
    }

    this.token = options.token
    this.chatId = options.chatId
    this.parseMode = options.parseMode || ''
    this.level = options.level || 'info'
    this.handleExceptions = options.handleExceptions ?? true
    this.unique = options.unique || false
    this.silent = options.silent || false
    this.disableNotification = options.disableNotification || false
    this.name = options.name || this.name || 'winston-telegram'
    this.template = options.template || '[{level}] {message}'
    this.formatMessage = options.formatMessage
    this.batchingDelay = options.batchingDelay || 0
    this.batchingSeparator = options.batchingSeparator || '\n\n'
    this.batchedMessages = []
    this.batchingTimeout = 0
  }

  /**
   * Core logging method exposed to Winston.
   *
   * @param {object} info - An object representing the log message.
   * @param {Function} callback - Continuation to respond to when complete.
   * @returns {undefined}
   */
  log (info, callback) {
    const self = this

    if (this.unique && this.level !== info.level) return callback(null, true)

    let messageText = null
    const formatOptions = {
      level: info.level,
      message: info.message,
      metadata: info.metadata
    }

    if (this.formatMessage) {
      messageText = this.formatMessage(formatOptions, info)
    } else {
      messageText = format(this.template, formatOptions)
    }

    if (this.batchingDelay) {
      this.batchedMessages.push(messageText)

      if (!this.batchingTimeout) {
        this.batchingTimeout = setTimeout(function () {
          const combinedMessages = self.batchedMessages.join(self.batchingSeparator)
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
   * Sends the given message to Telegram splitted as needed.
   *
   * @function send
   * @param {string} messageText - Formatted text to log.
   * @private
   */
  send (messageText) {
    const self = this

    if (messageText.length < MAX_MESSAGE_LENGTH) {
      self.sendMessage(messageText)
    } else {
      const size = Math.ceil(messageText.length / MAX_MESSAGE_LENGTH)
      const arr = Array(size)
      let offset = 0

      for (let i = 0; i < size; i++) {
        arr[i] = messageText.substr(offset, MAX_MESSAGE_LENGTH)
        offset += MAX_MESSAGE_LENGTH
      }
      arr.forEach(message => self.sendMessage(message))
    }
  }

  /**
   * Actual method that sends the given message to Telegram.
   *
   * @function sendMessage
   * @param {string} messageText - Formatted text to log.
   * @private
   */
  sendMessage (messageText) {
    const self = this

    const requestData = JSON.stringify({
      chat_id: this.chatId,
      text: messageText,
      disable_notification: this.disableNotification,
      parse_mode: this.parseMode
    })

    const options = {
      hostname: 'api.telegram.org',
      path: '/bot' + this.token + '/sendMessage',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(requestData)
      }
    }

    self.request(options, requestData, function (error, response, body) {
      if (error) {
        self.emit('error', error)
      }
      if (response && response.statusCode !== 200) {
        self.emit('error', response.statusCode + ((body && body.description && ': ' + body.description) || ''))
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
   * @private
   */
  request (options, requestData, callback) {
    const request = https.request(options, function (response) {
      let responseData = ''
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
}
