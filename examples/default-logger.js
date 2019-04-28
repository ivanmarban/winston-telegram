/*
 * Using the default logger.
 */

const logger = require('winston')
const TelegramLogger = require('../lib/winston-telegram')

logger.add(
  new TelegramLogger({
    token: 'TELEGRAM_TOKEN',
    chatId: 'CHAT_ID',
    level: 'error',
    unique: true
  })
)

logger.error('Heeere’s Johnny!')
logger.log({ level: 'error', message: 'Heeere’s Johnny!' })
