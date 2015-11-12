# winston-telegram

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

[0]: https://telegram.org/
[1]: https://github.com/flatiron/winston