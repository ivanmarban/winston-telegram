/*
 * Multiple transports, different chats, different options.
 */

const winston = require('winston')
const TelegramLogger = require('../lib/winston-telegram')

const logger = winston.createLogger({
  transports: [
    new TelegramLogger({
      name: 'error-channel',
      token: 'TELEGRAM_TOKEN',
      chatId: 'CHAT_ID',
      level: 'error',
      unique: true
    }),
    new TelegramLogger({
      name: 'info-channel',
      token: 'TELEGRAM_TOKEN',
      chatId: 'CHAT_ID',
      level: 'info',
      unique: true,
      disableNotification: true
    })
  ]
})

logger.error('All work and no play makes Jack a dull boy.')
logger.info('Come play with us, Danny. Forever... and ever... and ever.')
