/*
 * Using custom format message.
 */

const logger = require('winston')
const TelegramLogger = require('../lib/winston-telegram')

logger.add(
  new TelegramLogger({
    token: 'TELEGRAM_TOKEN',
    chatId: 'CHAT_ID',
    level: 'warn',
    unique: true,
    formatMessage: function (options) {
      let message = options.message
      if (options.level === 'warn') {
        message = '[Warning] ' + message
      }
      return message
    }
  })
)

logger.warn('Some warning!!')

// Output: [Warning] Some warning!!
