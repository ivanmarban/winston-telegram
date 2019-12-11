# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v2.2.1] - 2019-12-11
- [#16](https://github.com/ivanmarban/winston-telegram/issues/16) Use `Buffer.byteLength` to compute the `Content-Length` header.

## [v2.2.0] - 2019-08-06
- [#13](https://github.com/ivanmarban/winston-telegram/pull/13) Add typescript typings. ([@Multivit4min](https://github.com/Multivit4min))
- Update dependencies.

## [v2.1.0] - 2019-06-22
- Replace [Request](https://github.com/request/request) by standard https Node.js lib.
- Fix examples.

## [v2.0.1] - 2019-04-28
- Code style: ESLint + Standard + Prettier.
- Test coverage.
- Documenting with JSDoc.
- Removed silent callback since Winston >= 3 takes care of it while using silent option.

## [v2.0.0] - 2019-01-07
- `winston@3` support.

## [v1.3.1] - 2019-01-07
- [#12](https://github.com/ivanmarban/winston-telegram/pull/12) Fix comments. ([@is2ei](https://github.com/is2ei))
- Update dependencies.

## [v1.3.0] - 2018-05-03
- [#10](https://github.com/ivanmarban/winston-telegram/pull/10) Add formatMessage property. ([@noveogroup-amorgunov](https://github.com/noveogroup-amorgunov))

## [v1.2.1] - 2017-07-26
- [#9](https://github.com/ivanmarban/winston-telegram/pull/9) Add error description in case of error. ([@dutu](https://github.com/dutu))
- Update sf library.

## [v1.2.0] - 2017-06-03
- [#8](https://github.com/ivanmarban/winston-telegram/pull/8) Add batching of messages sent within a certain interval. ([@JustinOng](https://github.com/JustinOng))

## [v1.1.0] - 2017-05-02
- [#7](https://github.com/ivanmarban/winston-telegram/pull/7) Use metadata information in messages. ([@alberto467](https://github.com/alberto467))
- [#7](https://github.com/ivanmarban/winston-telegram/pull/7) Replace built-in format function by sf node module. ([@alberto467](https://github.com/alberto467))
- Update dependencies.

## [v1.0.0] - 2016-12-05
- [#6](https://github.com/ivanmarban/winston-telegram/pull/6) Add optional handleExceptions param. ([@speedone](https://github.com/speedone))
- Node.js coding style.
- Change option properties for matching coding style.

## [v0.4.0] - 2016-09-26
- [#5](https://github.com/ivanmarban/winston-telegram/issues/5) Add message template option.
- Update dependencies.
- Remove peer dependecies.

## [v0.3.0] - 2016-07-17
- [#2](https://github.com/ivanmarban/winston-telegram/issues/2) Allow multiple transports, send messages silently.
- Update dependencies.

## [v0.2.1] - 2016-03-30
- Fix typos.

## [v0.2.0] - 2016-03-08
- [#1](https://github.com/ivanmarban/winston-telegram/issues/1) Add log level option.

## [v0.1.0] - 2015-11-12
- First version.

[unreleased]: https://github.com/ivanmarban/winston-telegram/compare/v2.2.1...develop
[v2.2.1]: https://github.com/ivanmarban/winston-telegram/compare/v2.2.0...v2.2.1
[v2.2.0]: https://github.com/ivanmarban/winston-telegram/compare/v2.1.0...v2.2.0
[v2.1.0]: https://github.com/ivanmarban/winston-telegram/compare/v2.0.1...v2.1.0
[v2.0.1]: https://github.com/ivanmarban/winston-telegram/compare/v2.0.0...v2.0.1
[v2.0.0]: https://github.com/ivanmarban/winston-telegram/compare/v1.3.1...v2.0.0
[v1.3.1]: https://github.com/ivanmarban/winston-telegram/compare/v1.3.0...v1.3.1
[v1.3.0]: https://github.com/ivanmarban/winston-telegram/compare/v1.2.1...v1.3.0
[v1.2.1]: https://github.com/ivanmarban/winston-telegram/compare/v1.2.0...v1.2.1
[v1.2.0]: https://github.com/ivanmarban/winston-telegram/compare/v1.1.0...v1.2.0
[v1.1.0]: https://github.com/ivanmarban/winston-telegram/compare/v1.0.0...v1.1.0
[v1.0.0]: https://github.com/ivanmarban/winston-telegram/compare/v0.4.0...v1.0.0
[v0.4.0]: https://github.com/ivanmarban/winston-telegram/compare/v0.3.0...v0.4.0
[v0.3.0]: https://github.com/ivanmarban/winston-telegram/compare/v0.2.1...v0.3.0
[v0.2.1]: https://github.com/ivanmarban/winston-telegram/compare/v0.2.0...v0.2.1
[v0.2.0]: https://github.com/ivanmarban/winston-telegram/compare/v0.1.0...v0.2.0
[v0.1.0]: https://github.com/ivanmarban/winston-telegram/releases/tag/v0.1.0
