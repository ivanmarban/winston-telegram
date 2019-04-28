const should = require('chai').should()
const expect = require('chai').expect
const assert = require('chai').assert
const sinon = require('sinon')
const Transport = require('../lib/winston-telegram')
const winston = require('winston')
const mockery = require('mockery')

describe('winston-telegram', function () {
  describe('Creating the transport', function () {
    it("Should throw an error when 'token' or 'chatId' are undefined", function () {
      ;(() => new Transport()).should.throw(
        Error,
        "winston-telegram requires 'token' and 'chatId' property"
      )
    })

    it("Should throw an error when 'formatMessage' is not a function", function () {
      ;(() =>
        new Transport({
          token: 'foo',
          chatId: 'bar',
          formatMessage: 'foo'
        })).should.throw(
        Error,
        "winston-telegram 'formatMessage' property should be function"
      )
    })

    it('Should have default options when instantiated', function () {
      const transport = new Transport({ token: 'foo', chatId: 'bar' })

      assert.ok(transport.level === 'info')
      assert.ok(transport.handleExceptions === false)
      assert.ok(transport.unique === false)
      assert.ok(transport.silent === false)
      assert.ok(transport.disableNotification === false)
      assert.ok(transport.name === 'winston-telegram')
      assert.ok(transport.template === '[{level}] {message}')
      assert.ok(transport.formatMessage === undefined)
      assert.ok(transport.batchingDelay === 0)
      assert.ok(transport.batchingSeparator === '\n\n')
    })

    it('Should allow options to be set when instantiated', function () {
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
    })

    it("Should have a 'log' function", function () {
      const transport = new Transport({ token: 'foo', chatId: 'bar' })
      assert.ok(typeof transport.log === 'function')
    })

    it("Should have a 'send' function", function () {
      const transport = new Transport({ token: 'foo', chatId: 'bar' })
      assert.ok(typeof transport.send === 'function')
    })

    it('Can be registered as winston transport', function () {
      const logger = winston.createLogger({
        transports: [new Transport({ token: 'foo', chatId: 'bar' })]
      })
      assert.ok(logger._readableState.pipes.hasOwnProperty('token'))
    })
  })

  describe('Logging messages', function () {
    before(function () {
      mockery.enable({
        warnOnReplace: false,
        warnOnUnregistered: false,
        useCleanCache: true
      })
      this.requestStub = sinon.stub()
      mockery.registerMock('request', this.requestStub)
      this.TelegramTransport = require('../lib/winston-telegram')
      this.clock = sinon.useFakeTimers()
    })

    beforeEach(function () {
      winston.remove()
      this.requestStub.reset()
    })

    after(function () {
      mockery.disable()
      this.clock.restore()
    })

    it("Should send 'error' message", function () {
      this.requestStub.yields(
        null,
        { statusCode: 200 },
        { ok: true, result: {} }
      )
      winston.add(
        new this.TelegramTransport({
          token: 'foo',
          chatId: 'bar',
          level: 'error'
        })
      )
      winston.log({ level: 'error', message: 'error message' })
      assert.strictEqual(
        this.requestStub.getCalls()[0].args[0]['json']['text'],
        '[error] error message'
      )
    })

    it("Should send 'verbose' message only", function () {
      this.requestStub.yields(
        null,
        { statusCode: 200 },
        { ok: true, result: {} }
      )
      winston.add(
        new this.TelegramTransport({
          token: 'foo',
          chatId: 'bar',
          level: 'verbose',
          unique: true
        })
      )
      winston.log({ level: 'verbose', message: 'verbose message' })
      winston.log({ level: 'info', message: 'info message' })
      assert.strictEqual(
        this.requestStub.getCalls()[0].args[0]['json']['text'],
        '[verbose] verbose message'
      )
      assert.ok(this.requestStub.callCount === 1)
    })

    it('Should suppress output', function () {
      this.requestStub.yields(
        null,
        { statusCode: 200 },
        { ok: true, result: {} }
      )
      winston.add(
        new this.TelegramTransport({
          token: 'foo',
          chatId: 'bar',
          level: 'error',
          silent: true
        })
      )
      winston.log({ level: 'error', message: 'error message' })
      assert.ok(this.requestStub.callCount === 0)
    })

    it('Should send message without notification', function () {
      this.requestStub.yields(
        null,
        { statusCode: 200 },
        { ok: true, result: {} }
      )
      winston.add(
        new this.TelegramTransport({
          token: 'foo',
          chatId: 'bar',
          level: 'error',
          disableNotification: true
        })
      )
      winston.log({ level: 'error', message: 'error message' })
      assert.ok(this.requestStub.callCount === 1)
      assert.strictEqual(
        '[error] error message',
        this.requestStub.getCalls()[0].args[0]['json']['text']
      )
      assert.strictEqual(
        this.requestStub.getCalls()[0].args[0]['json']['disable_notification'],
        true
      )
    })

    it('Should send formatted message by template', function () {
      this.requestStub.yields(
        null,
        { statusCode: 200 },
        { ok: true, result: {} }
      )
      winston.add(
        new this.TelegramTransport({
          token: 'foo',
          chatId: 'bar',
          level: 'error',
          template:
            '[{level}] [{message}] [{metadata.name}] [{metadata.surname}]'
        })
      )
      winston.log({
        level: 'error',
        message: 'foo',
        metadata: { name: 'bar', surname: 'baz' }
      })
      assert.strictEqual(
        this.requestStub.getCalls()[0].args[0]['json']['text'],
        '[error] [foo] [bar] [baz]'
      )
      assert.ok(this.requestStub.callCount === 1)
    })

    it('Should send formatted message by custom function', function () {
      this.requestStub.yields(
        null,
        { statusCode: 200 },
        { ok: true, result: {} }
      )
      winston.add(
        new this.TelegramTransport({
          token: 'foo',
          chatId: 'bar',
          level: 'error',
          formatMessage: function (options) {
            let message = options.message
            if (options.level === 'error') {
              message = '[Error] ' + message
            }
            return message
          }
        })
      )
      winston.error('Some error!!')
      assert.strictEqual(
        this.requestStub.getCalls()[0].args[0]['json']['text'],
        '[Error] Some error!!'
      )
      assert.ok(this.requestStub.callCount === 1)
    })

    it('Should send batching of messages', function () {
      this.requestStub.yields(
        null,
        { statusCode: 200 },
        { ok: true, result: {} }
      )
      winston.add(
        new this.TelegramTransport({
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
      this.clock.tick(2500)
      expect(this.requestStub.getCalls()[0].args[0]['json']['text'])
        .to.be.an('string')
        .that.includes('First message')
      expect(this.requestStub.getCalls()[0].args[0]['json']['text'])
        .to.be.an('string')
        .that.includes('Second message')
      expect(this.requestStub.getCalls()[0].args[0]['json']['text'])
        .to.be.an('string')
        .that.includes('Third message')
      expect(this.requestStub.getCalls()[1].args[0]['json']['text'])
        .to.be.an('string')
        .that.includes('Fourth message')
      assert.ok(this.requestStub.callCount === 2)
    })
  })
  describe('Handling uncaught exceptions', function () {
    // figure out a better way of testing uncaught exceptions since mocha wraps them
    before(function () {
      mockery.enable({
        warnOnReplace: false,
        warnOnUnregistered: false,
        useCleanCache: true
      })
      this.requestStub = sinon.stub()
      mockery.registerMock('request', this.requestStub)
      this.TelegramTransport = require('../lib/winston-telegram')
      this.clock = sinon.useFakeTimers()
    })

    after(function () {
      mockery.disable()
      this.clock.restore()
    })

    it('Should handle general error', function () {
      this.requestStub.yields(
        'error',
        { statusCode: 500 },
        { ok: false, result: {} }
      )
      winston.exceptions.handle(new winston.transports.Console())
      winston.add(
        new this.TelegramTransport({
          token: 'foo',
          chatId: 'bar',
          level: 'info',
          handleExceptions: true
        })
      )
      try {
        winston.error('foo')
      } catch (error) {
        expect(error.message)
          .to.be.an('string')
          .that.equals("Unhandled error. ('error')")
      }
    })

    it('Should handle statusCode !== 200 error', function () {
      this.requestStub.yields(null, { statusCode: 503 }, { description: 'foo' })
      winston.exceptions.handle(new winston.transports.Console())
      winston.add(
        new this.TelegramTransport({
          token: 'foo',
          chatId: 'bar',
          level: 'info',
          handleExceptions: true
        })
      )
      try {
        winston.error('foo')
      } catch (error) {
        expect(error.message)
          .to.be.an('string')
          .that.equals("Unhandled error. ('503: foo')")
      }
    })

    it('Should handle statusCode !== 200 error with blank body', function () {
      this.requestStub.yields(null, { statusCode: 503 }, {})
      winston.exceptions.handle(new winston.transports.Console())
      winston.add(
        new this.TelegramTransport({
          token: 'foo',
          chatId: 'bar',
          level: 'info',
          handleExceptions: true
        })
      )
      try {
        winston.error('foo')
      } catch (error) {
        expect(error.message)
          .to.be.an('string')
          .that.equals("Unhandled error. ('503')")
      }
    })
  })
})
