# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v2.6.0] - 2022-05-15
### Fixed
- [#36](https://github.com/ivanmarban/winston-telegram/pull/36) Handle uncaught exceptions.

### Removed
-  Replace sf dependency by custom string templating implementation.

## [v2.5.0] - 2021-11-9
### Added
- [#29](https://github.com/ivanmarban/winston-telegram/issues/29) Split long messages.

## [v2.4.1] - 2021-09-26
### Changed
- Revert back sf dependency to latest version.

## [v2.4.0] - 2021-09-25
### Added
- [#27](https://github.com/ivanmarban/winston-telegram/pull/27) Pass full data argument to `formatMessage` method.

## [v2.3.5] - 2021-05-23
### Changed
- [#26](https://github.com/ivanmarban/winston-telegram/issues/26) Set `handleExceptions` option `true` by default.

## [v2.3.4] - 2021-04-02
### Fixed
- [#25](https://github.com/ivanmarban/winston-telegram/issues/25) Winston Transport can only be default-imported using the 'esModuleInterop' flag.

## [v2.3.3] - 2021-01-24
### Fixed
- [#24](https://github.com/ivanmarban/winston-telegram/pull/24) Change parseMode prop as optional.

## [v2.3.2] - 2020-11-08
### Fixed
- Tests fixed.

## [v2.3.1] - 2020-11-07
### Fixed
- [#23](https://github.com/ivanmarban/winston-telegram/pull/23) Fixed Typescript definition.

## [v2.3.0] - 2020-05-31
### Added
- [#17](https://github.com/ivanmarban/winston-telegram/pull/17) [#19](https://github.com/ivanmarban/winston-telegram/pull/19) Parse mode support for messages.

## [v2.2.2] - 2019-12-11
### Removed
- Drop node v6 from Travis CI

## [v2.2.1] - 2019-12-11
### Fixed
- [#16](https://github.com/ivanmarban/winston-telegram/issues/16) Use `Buffer.byteLength` to compute the `Content-Length` header.

## [v2.2.0] - 2019-08-06
### Added
- [#13](https://github.com/ivanmarban/winston-telegram/pull/13) Add typescript typings. ([@Multivit4min](https://github.com/Multivit4min))

### Changed
- Update dependencies.

## [v2.1.0] - 2019-06-22
### Changed
- Replace [Request](https://github.com/request/request) by standard https Node.js lib.

### Fixed
- Fix examples.

## [v2.0.1] - 2019-04-28
### Added
- Code style: ESLint + Standard + Prettier.
- Test coverage.
- Documenting with JSDoc.

### Changed
- Removed silent callback since Winston >= 3 takes care of it while using silent option.

## [v2.0.0] - 2019-01-07
### Added
- `winston@3` support.

## [v1.3.1] - 2019-01-07
### Fixed
- [#12](https://github.com/ivanmarban/winston-telegram/pull/12) Fix comments. ([@is2ei](https://github.com/is2ei))

### Changed
- Update dependencies.

## [v1.3.0] - 2018-05-03
### Added
- [#10](https://github.com/ivanmarban/winston-telegram/pull/10) Add formatMessage property. ([@noveogroup-amorgunov](https://github.com/noveogroup-amorgunov))

## [v1.2.1] - 2017-07-26
### Added
- [#9](https://github.com/ivanmarban/winston-telegram/pull/9) Add error description in case of error. ([@dutu](https://github.com/dutu))

### Changed
- Update sf library.

## [v1.2.0] - 2017-06-03
### Added
- [#8](https://github.com/ivanmarban/winston-telegram/pull/8) Add batching of messages sent within a certain interval. ([@JustinOng](https://github.com/JustinOng))

## [v1.1.0] - 2017-05-02
### Added
- [#7](https://github.com/ivanmarban/winston-telegram/pull/7) Use metadata information in messages. ([@alberto467](https://github.com/alberto467))

### Changed
- [#7](https://github.com/ivanmarban/winston-telegram/pull/7) Replace built-in format function by sf node module. ([@alberto467](https://github.com/alberto467))
- Update dependencies.

## [v1.0.0] - 2016-12-05
### Added
- [#6](https://github.com/ivanmarban/winston-telegram/pull/6) Add optional handleExceptions param. ([@speedone](https://github.com/speedone))
- Node.js coding style.

### Changed
- Change option properties for matching coding style.

## [v0.4.0] - 2016-09-26
### Added
- [#5](https://github.com/ivanmarban/winston-telegram/issues/5) Add message template option.

### Changed
- Update dependencies.

### Removed
- Remove peer dependecies.

## [v0.3.0] - 2016-07-17
### Added
- [#2](https://github.com/ivanmarban/winston-telegram/issues/2) Allow multiple transports, send messages silently.

### Changed
- Update dependencies.

## [v0.2.1] - 2016-03-30
### Fixed
- Fix typos.

## [v0.2.0] - 2016-03-08
### Added
- [#1](https://github.com/ivanmarban/winston-telegram/issues/1) Add log level option.

## [v0.1.0] - 2015-11-12
- First version.

[unreleased]: https://github.com/ivanmarban/winston-telegram/compare/v2.6.0...develop
[v2.6.0]: https://github.com/ivanmarban/winston-telegram/compare/v2.5.0...v2.6.0
[v2.5.0]: https://github.com/ivanmarban/winston-telegram/compare/v2.4.1...v2.5.0
[v2.4.1]: https://github.com/ivanmarban/winston-telegram/compare/v2.4.0...v2.4.1
[v2.4.0]: https://github.com/ivanmarban/winston-telegram/compare/v2.3.5...v2.4.0
[v2.3.5]: https://github.com/ivanmarban/winston-telegram/compare/v2.3.4...v2.3.5
[v2.3.4]: https://github.com/ivanmarban/winston-telegram/compare/v2.3.3...v2.3.4
[v2.3.3]: https://github.com/ivanmarban/winston-telegram/compare/v2.3.2...v2.3.3
[v2.3.2]: https://github.com/ivanmarban/winston-telegram/compare/v2.3.1...v2.3.2
[v2.3.1]: https://github.com/ivanmarban/winston-telegram/compare/v2.3.0...v2.3.1
[v2.3.0]: https://github.com/ivanmarban/winston-telegram/compare/v2.2.2...v2.3.0
[v2.2.2]: https://github.com/ivanmarban/winston-telegram/compare/v2.2.1...v2.2.2
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
