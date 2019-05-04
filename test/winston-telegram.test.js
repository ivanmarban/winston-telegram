var vows = require('vows')
var assert = require('assert')
var helpers = require('winston/test/helpers')
var Telegram = require('../lib/winston-telegram').Telegram
var TelegramTransport

TelegramTransport = new Telegram({
  token: 'TOKEN',
  chatId: 'CHAT_ID'
})

function assertTelegram (transport) {
  assert.instanceOf(transport, Telegram)
  assert.isFunction(transport.log)
}

vows
  .describe('winston-telegram')
  .addBatch({
    'An instance of the Telegram Transport': {
      'when passed an options': {
        'should have the proper methods defined': function () {
          assertTelegram(TelegramTransport)
        },
        'the log() method': helpers.testNpmLevels(
          TelegramTransport,
          'should log messages to Telegram',
          function (ign, err, logged) {
            assert.isNull(err)
            assert.isTrue(logged)
          }
        )
      }
    }
  })
  .export(module)
