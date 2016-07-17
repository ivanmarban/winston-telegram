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
* __chatid:__ The chatid you want to send to. *[required]*
* __level:__ Level of messages that this transport should log. *[optional]* *[default info]*
* __unique:__ Whether to log only the declared level and none above. *[boolean]* *[optional]*
* __silent:__ Whether to suppress output. *[boolean]* *[optional]*
* __disable_notification:__ Sends the message silently. *[boolean]* *[optional]*

## Examples
Using the Default Logger 
``` js
var winston = require('winston');

require('winston-telegram').Telegram;

winston.add(winston.transports.Telegram, {
		token : 'TELEGRAM_TOKEN',
		chatid : 'CHAT_ID',
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
			chatid : 'CHAT_ID_1',
			level : 'error',
			unique : true	
		}),
		new (winston.transports.Telegram)({
			name: 'info-channel',
			token : 'TELEGRAM_TOKEN',
			chatid : 'CHAT_ID_2',
			level : 'info',
			unique : true,
			disable_notification: true
		})
	]
});

logger.error('All work and no play makes Jack a dull boy.');
logger.info('Come play with us, Danny. Forever... and ever... and ever.');
```

[0]: https://telegram.org/
[1]: https://github.com/flatiron/winston