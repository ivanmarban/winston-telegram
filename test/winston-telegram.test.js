const should = require('chai').should()
const expect = require('chai').expect
const assert = require('chai').assert
const sinon = require('sinon')
const Transport = require('../lib/winston-telegram')
const winston = require('winston')
const nock = require('nock')

describe('winston-telegram', function () {
  describe('Creating the transport', function () {
    it("Should throw an error when 'token' or 'chatId' are undefined", function (done) {
      ;(() => new Transport()).should.throw(Error, "winston-telegram requires 'token' and 'chatId' property")
      done()
    })

    it("Should throw an error when 'formatMessage' is not a function", function (done) {
      ;(() =>
        new Transport({
          token: 'foo',
          chatId: 'bar',
          formatMessage: 'foo'
        })).should.throw(Error, "winston-telegram 'formatMessage' property should be function")
      done()
    })

    it('Should have default options when instantiated', function (done) {
      const transport = new Transport({ token: 'foo', chatId: 'bar' })

      assert.ok(transport.level === 'info')
      assert.ok(transport.handleExceptions === true)
      assert.ok(transport.unique === false)
      assert.ok(transport.silent === false)
      assert.ok(transport.disableNotification === false)
      assert.ok(transport.name === 'winston-telegram')
      assert.ok(transport.template === '[{level}] {message}')
      assert.ok(transport.formatMessage === undefined)
      assert.ok(transport.batchingDelay === 0)
      assert.ok(transport.batchingSeparator === '\n\n')
      done()
    })

    it('Should allow options to be set when instantiated', function (done) {
      const transport = new Transport({
        name: 'error-channel',
        token: 'foo',
        chatId: 'bar',
        level: 'error',
        unique: true,
        disableNotification: true,
        handleExceptions: true,
        silent: true,
        template: '{level} -- {message}',
        formatMessage: function () {}
      })

      assert.ok(transport.level === 'error')
      assert.ok(transport.handleExceptions === true)
      assert.ok(transport.unique === true)
      assert.ok(transport.silent === true)
      assert.ok(transport.disableNotification === true)
      assert.ok(transport.name === 'error-channel')
      assert.ok(transport.template === '{level} -- {message}')
      assert.ok(typeof transport.formatMessage === 'function')
      done()
    })

    it("Should have a 'log' function", function (done) {
      const transport = new Transport({ token: 'foo', chatId: 'bar' })
      assert.ok(typeof transport.log === 'function')
      done()
    })

    it("Should have a 'send' function", function (done) {
      const transport = new Transport({ token: 'foo', chatId: 'bar' })
      assert.ok(typeof transport.send === 'function')
      done()
    })

    it("Should have a 'request' function", function (done) {
      const transport = new Transport({ token: 'foo', chatId: 'bar' })
      assert.ok(typeof transport.request === 'function')
      done()
    })

    it('Can be registered as winston transport', function (done) {
      const logger = winston.createLogger({
        transports: [new Transport({ token: 'foo', chatId: 'bar' })]
      })
      assert.ok(Object.prototype.hasOwnProperty.call(logger._readableState.pipes, 'token'))
      done()
    })
  })

  describe('Logging messages', function () {
    let spy, clock

    beforeEach(function () {
      winston.clear()
      clock = sinon.useFakeTimers()
      spy = sinon.spy(Transport.prototype, 'request')
    })

    afterEach(function () {
      nock.cleanAll()
      clock.restore()
      if (spy) spy.restore()
    })

    it("Should send 'error' message", function (done) {
      nock('https://api.telegram.org')
        .post('/botfoo/sendMessage')
        .reply(200, { ok: true, result: {} })
      winston.add(
        new Transport({
          token: 'foo',
          chatId: 'bar',
          level: 'error'
        })
      )
      winston.log({ level: 'error', message: 'error message' })
      assert.strictEqual(JSON.parse(spy.getCalls()[0].args[1]).text, '[error] error message')
      assert.ok(spy.callCount === 1)
      done()
    })

    it("Should send 'verbose' message only", function (done) {
      nock('https://api.telegram.org')
        .post('/botfoo/sendMessage')
        .reply(200, { ok: true, result: {} })
      winston.add(
        new Transport({
          token: 'foo',
          chatId: 'bar',
          level: 'verbose',
          unique: true
        })
      )
      winston.log({ level: 'verbose', message: 'verbose message' })
      winston.log({ level: 'info', message: 'info message' })
      assert.strictEqual(JSON.parse(spy.getCalls()[0].args[1]).text, '[verbose] verbose message')
      assert.ok(spy.callCount === 1)
      done()
    })

    it('Should suppress output', function (done) {
      nock('https://api.telegram.org')
        .post('/botfoo/sendMessage')
        .optionally()
        .reply(200, { ok: true, result: {} })
      winston.add(
        new Transport({
          token: 'foo',
          chatId: 'bar',
          level: 'error',
          silent: true
        })
      )
      winston.log({ level: 'error', message: 'error message' })
      assert.ok(spy.callCount === 0)
      done()
    })

    it('Should send message without notification', function (done) {
      nock('https://api.telegram.org')
        .post('/botfoo/sendMessage')
        .optionally()
        .reply(200, { ok: true, result: {} })
      winston.add(
        new Transport({
          token: 'foo',
          chatId: 'bar',
          level: 'error',
          disableNotification: true
        })
      )
      winston.log({ level: 'error', message: 'error message' })
      assert.strictEqual(JSON.parse(spy.getCalls()[0].args[1]).text, '[error] error message')
      assert.strictEqual(JSON.parse(spy.getCalls()[0].args[1]).disable_notification, true)
      assert.ok(spy.callCount === 1)
      done()
    })

    it('Should send formatted message by template', function (done) {
      nock('https://api.telegram.org')
        .post('/botfoo/sendMessage')
        .reply(200, { ok: true, result: {} })
      winston.add(
        new Transport({
          token: 'foo',
          chatId: 'bar',
          level: 'error',
          template: '[{level}] [{message}] [{metadata.name}] [{metadata.surname}]'
        })
      )
      winston.log({
        level: 'error',
        message: 'foo',
        metadata: { name: 'bar', surname: 'baz' }
      })
      assert.strictEqual(JSON.parse(spy.getCalls()[0].args[1]).text, '[error] [foo] [bar] [baz]')
      assert.ok(spy.callCount === 1)
      done()
    })

    it('Should send formatted message by custom function', function (done) {
      nock('https://api.telegram.org')
        .post('/botfoo/sendMessage')
        .reply(200, { ok: true, result: {} })
      winston.add(
        new Transport({
          token: 'foo',
          chatId: 'bar',
          level: 'error',
          formatMessage: function (options, info) {
            let message = options.message

            if (options.level === 'error') {
              message = '[Error] ' + message
            }

            if (info.superUrgent) {
              message += '!!!'
            }

            return message
          }
        })
      )
      winston.error('Some error', { superUrgent: true })
      assert.strictEqual(JSON.parse(spy.getCalls()[0].args[1]).text, '[Error] Some error!!!')
      assert.ok(spy.callCount === 1)
      done()
    })

    it('Should send batching of messages', function (done) {
      nock('https://api.telegram.org')
        .post('/botfoo/sendMessage')
        .times(2)
        .reply(200, { ok: true, result: {} })
      winston.add(
        new Transport({
          token: 'foo',
          chatId: 'bar',
          level: 'info',
          batchingDelay: 1000
        })
      )
      winston.info('First message: ' + new Date().toString())
      winston.info('Second message: ' + new Date().toString())
      setTimeout(function () {
        winston.info('Third message: ' + new Date().toString())
      }, 500)
      setTimeout(function () {
        winston.info('Fourth message: ' + new Date().toString())
      }, 1500)
      clock.tick(2500)
      expect(JSON.parse(spy.getCalls()[0].args[1]).text)
        .to.be.an('string')
        .that.includes('First message')
      expect(JSON.parse(spy.getCalls()[0].args[1]).text)
        .to.be.an('string')
        .that.includes('Second message')
      expect(JSON.parse(spy.getCalls()[0].args[1]).text)
        .to.be.an('string')
        .that.includes('Third message')
      expect(JSON.parse(spy.getCalls()[1].args[1]).text)
        .to.be.an('string')
        .that.includes('Fourth message')
      assert.ok(spy.callCount === 2)
      done()
    })

    it('Should send splited message', function (done) {
      nock('https://api.telegram.org')
        .post('/botfoo/sendMessage')
        .times(2)
        .reply(200, { ok: true, result: {} })
      winston.add(
        new Transport({
          token: 'foo',
          chatId: 'bar',
          level: 'error'
        })
      )
      winston.error('a'.repeat(5000))
      assert.strictEqual(JSON.parse(spy.getCalls()[0].args[1]).text.length, 4096)
      assert.strictEqual(JSON.parse(spy.getCalls()[1].args[1]).text.length, 912)
      assert.ok(spy.callCount === 2)
      done()
    })
  })

  describe('Emitting errors', function () {
    it('Should emit error if request returns an error', function (done) {
      nock('https://api.telegram.org')
        .post('/botfoo/sendMessage')
        .replyWithError('something awful happened')
      const transport = new Transport({
        token: 'foo',
        chatId: 'bar',
        level: 'error'
      })
      const logger = winston.createLogger({
        transports: [transport],
        exitOnError: false
      })
      logger.on('error', function (error) {
        expect(error)
          .to.be.an.instanceOf(Error)
          .that.has.property('message')
          .that.is.a('string')
          .that.eq('something awful happened')
        done()
      })
      logger.error('error')
    })

    it('Should emit error if request returns statusCode !== 200', function (done) {
      nock('https://api.telegram.org')
        .post('/botfoo/sendMessage')
        .reply(500, { ok: false, description: 'something awful happened' })
      const transport = new Transport({
        token: 'foo',
        chatId: 'bar',
        level: 'error'
      })
      const logger = winston.createLogger({
        transports: [transport],
        exitOnError: false
      })
      logger.on('error', function (error) {
        expect(error)
          .to.be.a('string')
          .that.eq('500: something awful happened')
        done()
      })
      logger.error('error')
    })

    it('Should emit error if request returns statusCode !== 200 with empty body', function (done) {
      nock('https://api.telegram.org')
        .post('/botfoo/sendMessage')
        .reply(500, { ok: false, description: null })
      const transport = new Transport({
        token: 'foo',
        chatId: 'bar',
        level: 'error'
      })
      const logger = winston.createLogger({
        transports: [transport],
        exitOnError: false
      })
      logger.on('error', function (error) {
        expect(error)
          .to.be.a('string')
          .that.eq('500')
        done()
      })
      logger.error('error')
    })
  })
})
