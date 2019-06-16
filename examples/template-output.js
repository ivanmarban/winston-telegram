/*
 * Using template output.
 */

const logger = require('winston')
const TelegramLogger = require('../lib/winston-telegram')

logger.add(
  new TelegramLogger({
    token: 'TELEGRAM_TOKEN',
    chatId: 'CHAT_ID',
    level: 'error',
    unique: true,
    template: '[{level}] [{message}] [{metadata.name}] [{metadata.surname}]'
  })
)

logger.log({
  level: 'error',
  message: 'Redrum. Redrum. Redrum.',
  metadata: { name: 'Danny', surname: 'Torrance' }
})

// Output: [error] [Redrum. Redrum. Redrum.] [Danny] [Torrance]
