/*
 * Using template output.
 */

var winston = require('winston')

require('../lib/winston-telegram').Telegram

winston.add(winston.transports.Telegram, {
  token: 'TELEGRAM_TOKEN',
  chatId: 'CHAT_ID',
  level: 'error',
  unique: true,
  template: '[{level}] [{message}] [{metadata.name}] [{metadata.surname}]'
})

winston.log('error', 'Redrum. Redrum. Redrum.', {
  name: 'Danny',
  surname: 'Torrance'
})

// Output: [error] [Redrum. Redrum. Redrum.] [Danny] [Torrance]
