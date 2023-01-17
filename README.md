# Js Object to JSON Converter

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

> Js Object (as string) to JSON Converter

## Install

```bash
npm install js-object-to-json
```

## Usage

```ts
import { jsObjectAsStringToJSON } from 'js-object-to-json';

jsObjectAsStringToJSON(`
{
  foo: 'bar',
  "baz": false,
  'foo-baz': [1,2,3, ], /* some comment */
}
`);
//=>
// {
//   "foo": "bar",
//   "baz": false,
//   "foo-baz": [1,2,3 ]
// }
```

[build-img]: https://github.com/jackardios/js-object-to-json/actions/workflows/release.yml/badge.svg
[build-url]: https://github.com/jackardios/js-object-to-json/actions/workflows/release.yml
[downloads-img]: https://img.shields.io/npm/dt/js-object-to-json
[downloads-url]: https://www.npmtrends.com/js-object-to-json
[npm-img]: https://img.shields.io/npm/v/js-object-to-json
[npm-url]: https://www.npmjs.com/package/js-object-to-json
[issues-img]: https://img.shields.io/github/issues/jackardios/js-object-to-json
[issues-url]: https://github.com/jackardios/js-object-to-json/issues
[semantic-release-img]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[commitizen-img]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
