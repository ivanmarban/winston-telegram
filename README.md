# winston-telegram

[![NPM](https://nodei.co/npm/winston-telegram.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/winston-telegram/)

A [Telegram][0] transport for [winston][1].

[![Version npm](https://img.shields.io/npm/v/winston-telegram.svg)](https://www.npmjs.com/package/winston-telegram)
[![npm Downloads](https://img.shields.io/npm/dw/winston-telegram.svg)](https://npmcharts.com/compare/winston-telegram?minimal=true)
[![CI Status](https://github.com/ivanmarban/winston-telegram/actions/workflows/ci.yaml/badge.svg?branch=master)](https://github.com/ivanmarban/winston-telegram/actions/workflows/ci.yaml)
[![Coverage Status](https://coveralls.io/repos/github/ivanmarban/winston-telegram/badge.svg?branch=master)](https://coveralls.io/github/ivanmarban/winston-telegram?branch=master)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## winston-telegram@2

Installation:
``` sh
$ npm install winston@3
$ npm install winston-telegram@2
```

## Looking for `winston-telegram@1.x` ?
Documentation below is for `winston-telegram@2`. [Read the `winston-telegram@1.x` documentation][2].

## Usage
``` js
const logger = require('winston')
const TelegramLogger = require('winston-telegram')

// or
import TelegramLogger from 'winston-telegram';

logger.add(new TelegramLogger(options))
```

Options:

* `token` The Telegram bot authentication token. *[required]*
* `chatId` The Telegram chatid you want to send to. *[required]*
* `messageThreadId` The Telegram unique identifier of a message thread to which the message belongs. *[optional]*
* `parseMode` The Telegram mode for parsing entities in the message text. See [formatting options][4] for more details. *[optional]*
* `level` Level of messages that this transport should log. *[optional]* *[default info]*
* `unique` Whether to log only the declared level and none above. *[boolean]* *[optional]*
* `silent` Whether to suppress output. *[boolean]* *[optional]*
* `disableNotification` Sends the message silently. *[boolean]* *[optional]*
* `template` Format output message. *[string]* *[optional]*
* `formatMessage` Format output message by own method. *[function]* *[optional]*
* `handleExceptions` Handle uncaught exceptions. *[boolean]* *[optional]*
* `batchingDelay` Time in ms within which to batch messages together. *[integer]* *[optional]* *[default 0 or disabled]*
* `batchingSeparator` String with which to join batched messages with *[string]* *[default "\n\n"]*

String template is based on named arguments:
``` js
'{level}' -> level of messages
'{message}' -> text of messages
'{metadata}' -> metadata object of messages
```

## Examples

Follow below steps to run the examples:

``` sh
$ git clone git@github.com:ivanmarban/winston-telegram.git -b master --single-branch
$ npm install
```

Replace `TELEGRAM_TOKEN` and `CHAT_ID` with appropiate values, then run whatever example you want:

``` sh
$ node examples/default-logger.js
```

[0]: https://telegram.org/
[1]: https://github.com/flatiron/winston
[2]: https://github.com/ivanmarban/winston-telegram/tree/1.x
[3]: https://github.com/ivanmarban/winston-telegram/tree/master/examples
[4]: https://core.telegram.org/bots/api#formatting-options
