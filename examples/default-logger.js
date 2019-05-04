/*
 * Using the default logger.
 */

var winston = require('winston')

require('../lib/winston-telegram').Telegram

winston.add(winston.transports.Telegram, {
  token: 'TELEGRAM_TOKEN',
  chatId: 'CHAT_ID',
  level: 'error',
  unique: true
})

winston.log('error', 'Heeere’s Johnny!')
