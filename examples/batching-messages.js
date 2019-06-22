/*
 * Using batching of messages to avoid exceeding rate limits.
 */

const logger = require('winston')
const TelegramLogger = require('../lib/winston-telegram')

logger.add(
  new TelegramLogger({
    token: 'TELEGRAM_TOKEN',
    chatId: 'CHAT_ID',
    level: 'info',
    batchingDelay: 1000
  })
)

// first message triggers a new batchingDelay wait
logger.info('First message: ' + new Date().toString())
// second message is within the batchingDelay wait triggered by the first
// message, so will be batched
logger.info('Second message: ' + new Date().toString())

setTimeout(function () {
  // third message is also within the wait, so also batched
  logger.info('Third message: ' + new Date().toString())
}, 500)

setTimeout(function () {
  // fourth message is not within the wait, will be sent separately
  logger.info('Fourth message: ' + new Date().toString())
}, 1500)

/*
 * Output on Telegram:
 * Sent at 5:22:49PM:
 *   [info] First message: Tue May 30 2017 17:22:47 GMT+0800 (+08)
 *
 *   [info] Second message: Tue May 30 2017 17:22:47 GMT+0800 (+08)
 *
 *   [info] Third message: Tue May 30 2017 17:22:47 GMT+0800 (+08)
 *
 * Sent at 5:22:50PM:
 *   [info] Fourth message: Tue May 30 2017 17:22:48 GMT+0800 (+08)
 */
