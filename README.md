# winston-telegram

[![NPM](https://nodei.co/npm/winston-telegram.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/winston-telegram/)

A [Telegram][0] transport for [winston][1].

![NPM (Tag)](https://img.shields.io/npm/v/winston-telegram/1.x-latest.svg)
[![NPM Downloads](https://img.shields.io/npm/dw/winston-telegram.svg)](https://npmcharts.com/compare/winston-telegram?minimal=true)
[![Build Status](https://travis-ci.org/ivanmarban/winston-telegram.svg?branch=1.x)](https://travis-ci.org/ivanmarban/winston-telegram)
[![Dependencies Status](https://david-dm.org/ivanmarban/winston-telegram/1.x/status.svg)](https://david-dm.org/ivanmarban/winston-telegram)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=SJLW6PTHQQNBS)

## Installation

``` sh
$ npm install winston@2
$ npm install winston-telegram@1
```

## Usage
``` js
var winston = require('winston')

/*
 * Requiring `winston-telegram` will expose
 * `winston.transports.Telegram`
 */
require('winston-telegram').Telegram

winston.add(winston.transports.Telegram, options)
```

Options are the following:

* __token:__ The Telegram bot authentication token. *[required]*
* __chatId:__ The chatid you want to send to. *[required]*
* __level:__ Level of messages that this transport should log. *[optional]* *[default info]*
* __unique:__ Whether to log only the declared level and none above. *[boolean]* *[optional]*
* __silent:__ Whether to suppress output. *[boolean]* *[optional]*
* __disableNotification:__ Sends the message silently. *[boolean]* *[optional]*
* __template:__ Format output message. *[string]* *[optional]*
* __formatMessage:__ Format output message by own method. *[function]* *[optional]*
* __handleExceptions:__ Handle uncaught exceptions. *[boolean]* *[optional]*
* __batchingDelay:__ Time in ms within which to batch messages together. *[integer]* *[optional]* *[default 0 or disabled]*
* __batchingSeparator:__ String with which to join batched messages with *[string]* *[default '\n\n']*

String template is based on named arguments:
``` js
'{level}' -> level of messages
'{message}' -> text of messages
'{metadata}' -> metadata object of messages
```

## Examples

Follow above steps to run the examples:

``` sh
$ git clone git@github.com:ivanmarban/winston-telegram.git -b 1.x --single-branch
$ npm install
```

Replace `TELEGRAM_TOKEN` and `CHAT_ID` with appropiate values, then run whatever example you want:

``` sh
$ node test/default-logger.js
```

[0]: https://telegram.org/
[1]: https://github.com/flatiron/winston
