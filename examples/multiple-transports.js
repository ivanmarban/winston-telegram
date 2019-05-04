/*
 * Multiple transports, different chats, different options.
 */

var winston = require('winston')

require('../lib/winston-telegram').Telegram

var logger = new winston.Logger({
  transports: [
    new winston.transports.Telegram({
      name: 'error-channel',
      token: 'TELEGRAM_TOKEN',
      chatId: 'CHAT_ID_1',
      level: 'error',
      unique: true
    }),
    new winston.transports.Telegram({
      name: 'info-channel',
      token: 'TELEGRAM_TOKEN',
      chatId: 'CHAT_ID_2',
      level: 'info',
      unique: true,
      disableNotification: true
    })
  ]
})

logger.error('All work and no play makes Jack a dull boy.')
logger.info('Come play with us, Danny. Forever... and ever... and ever.')
