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

String template is based on named arguments:
``` js
'{level}' -> level of messages
'{message}' -> text of messages
'{meta}' -> meta object of messages
```

Due applying some coding style, you must change these option properties if you're updating from lower versions to 1.0.0:

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
		template : '[{level}] [{message}] [{meta.property1}] [{meta.property2}]'
    });

winston.log('error', 'Redrum. Redrum. Redrum.', { property1: 'foo', property2: 'bar' });

//Output: [error] [Redrum. Redrum. Redrum.] [foo] [bar]
```

## Change history

### v1.0.0 (2016/12/05)
- [#6](https://github.com/ivanmarban/winston-telegram/pull/6) Add optional handleExceptions param (@speedone)
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
