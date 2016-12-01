/*
 * winston-telegram-test.js: Tests for instances of the Telegram transport
 *
 * (C) 2015 Ivan Marban
 * MIT LICENSE
 */
var vows = require('vows'),
  assert = require('assert'),
  winston = require('winston'),
  helpers = require('winston/test/helpers'),
  Telegram = require('../lib/winston-telegram').Telegram;

var TelegramTransport;

TelegramTransport = new(Telegram)({
  token: '177492804:AAG318J_PjC03-okUmqQV652EDbf_Rr0vTo',
  chatid: '-50115750'
});

function assertTelegram(transport) {
  assert.instanceOf(transport, Telegram);
  assert.isFunction(transport.log);
}

vows.describe('winston-telegram').addBatch({
  'An instance of the Telegram Transport': {
    'when passed an options': {
      'should have the proper methods defined': function() {
        assertTelegram(TelegramTransport);
      },
      'the log() method': helpers.testNpmLevels(TelegramTransport, 'should log messages to Telegram', function(ign, err, logged) {
        assert.isNull(err);
        assert.isTrue(logged);
      })
    }
  }
}).export(module);