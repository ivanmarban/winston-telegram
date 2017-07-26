# winston-telegram

[![NPM](https://nodei.co/npm/winston-telegram.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/winston-telegram/)

A [Telegram][0] transport for [winston][1].

## Installation

``` sh
$ npm install winston
$ npm install winston-telegram
```

## Usage
``` js
var winston = require('winston');

/*
 * Requiring `winston-telegram` will expose
 * `winston.transports.Telegram`
 */
require('winston-telegram').Telegram;

winston.add(winston.transports.Telegram, options);
```

Options are the following:

* __token:__ The Telegram bot authentication token. *[required]*
* __chatId:__ The chatid you want to send to. *[required]*
* __level:__ Level of messages that this transport should log. *[optional]* *[default info]*
* __unique:__ Whether to log only the declared level and none above. *[boolean]* *[optional]*
* __silent:__ Whether to suppress output. *[boolean]* *[optional]*
* __disableNotification:__ Sends the message silently. *[boolean]* *[optional]*
* __template:__ Format output message. *[optional]*
* __handleExceptions:__ Handle uncaught exceptions. *[boolean]* *[optional]*
* __batchingDelay:__ Time in ms within which to batch messages together. *[integer]* *[optional]* *[default 0 or disabled]*
* __batchingSeparator:__ String with which to join batched messages with *[string]* *[default "\n\n"]*

String template is based on named arguments:
``` js
'{level}' -> level of messages
'{message}' -> text of messages
'{metadata}' -> metadata object of messages
```

Due applying some coding style, you must change these option properties if you're updating from lower versions to >=1.0.0:

- chatid to chatId
- disable_notificacion to disableNotification

## Examples
Using the Default Logger
``` js
var winston = require('winston');

require('winston-telegram').Telegram;

winston.add(winston.transports.Telegram, {
		token : 'TELEGRAM_TOKEN',
		chatId : 'CHAT_ID',
		level : 'error',
		unique : true
    });

winston.log('error', 'Heeere’s Johnny!');
```
Multiple transports, different chats, different options
``` js
var winston = require('winston');

require('winston-telegram').Telegram;

var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Telegram)({
			name: 'error-channel',
			token : 'TELEGRAM_TOKEN',
			chatId : 'CHAT_ID_1',
			level : 'error',
			unique : true
		}),
		new (winston.transports.Telegram)({
			name: 'info-channel',
			token : 'TELEGRAM_TOKEN',
			chatId : 'CHAT_ID_2',
			level : 'info',
			unique : true,
			disableNotification: true
		})
	]
});

logger.error('All work and no play makes Jack a dull boy.');
logger.info('Come play with us, Danny. Forever... and ever... and ever.');
```

Using template output:
``` js
var winston = require('winston');

require('winston-telegram').Telegram;

winston.add(winston.transports.Telegram, {
		token : 'TELEGRAM_TOKEN',
		chatId : 'CHAT_ID',
		level : 'error',
		unique : true,
		template : '[{level}] [{message}] [{metadata.name}] [{metadata.surname}]'
    });

winston.log('error', 'Redrum. Redrum. Redrum.', { name: 'Danny', surname: 'Torrance' });

//Output: [error] [Redrum. Redrum. Redrum.] [Danny] [Torrance]
```

Using batching of messages to avoid exceeding rate limits:
``` js
var winston = require('winston');

require('winston-telegram').Telegram;

winston.add(winston.transports.Telegram, {
		token : 'TELEGRAM_TOKEN',
		chatId : 'CHAT_ID',
		level : 'info',
		batchingDelay: 1000
});

// first message triggers a new batchingDelay wait
winston.info('First message: '+(new Date()).toString());
// second message is within the batchingDelay wait triggered by the first
// message, so will be batched
winston.info('Second message: '+(new Date()).toString());

setTimeout(function() {
  // third message is also within the wait, so also batched
  winston.info('Third message: '+(new Date()).toString());
}, 500);

setTimeout(function() {
  // fourth message is not within the wait, will be sent separately
  winston.info('Fourth message: '+(new Date()).toString());
}, 1500);

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
```

## Change history

### v1.2.1 (2017/07/26)
- [#9](https://github.com/ivanmarban/winston-telegram/pull/9) Add error description in case of error ([@dutu][5])

### v1.2.0 (2017/03/06)
- [#8](https://github.com/ivanmarban/winston-telegram/pull/8) Add batching of messages sent within a certain interval ([@JustinOng][4])

### v1.1.0 (2017/05/02)
- [#7](https://github.com/ivanmarban/winston-telegram/pull/7) Use metadata information in messages ([@alberto467][3])
- [#7](https://github.com/ivanmarban/winston-telegram/pull/7) Replace built-in format function by sf node module ([@alberto467][3])
- Update dependencies

### v1.0.0 (2016/12/05)
- [#6](https://github.com/ivanmarban/winston-telegram/pull/6) Add optional handleExceptions param ([@speedone][2])
- Node.js coding style
- Change option properties for matching coding style

### v0.4.0 (2016/09/26)
- [#5](https://github.com/ivanmarban/winston-telegram/issues/5) Add message template option
- Update dependencies
- Remove peer dependecies

### v0.3.0 (2016/07/17)
- [#2](https://github.com/ivanmarban/winston-telegram/issues/2) Allow multiple transports, send messages silently
- Update dependencies

### v0.2.1 (2016/03/30)
- Fix typos

### v0.2.0 (2016/03/08)
- [#1](https://github.com/ivanmarban/winston-telegram/issues/1) Add log level option

### v0.1.0 (2015/11/12)
- First version

[0]: https://telegram.org/
[1]: https://github.com/flatiron/winston
[2]: https://github.com/speedone
[3]: https://github.com/alberto467
[4]: https://github.com/JustinOng
[5]: https://github.com/dutu