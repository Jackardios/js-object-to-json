# Tolerant JSON parser

[![npm package][npm-img]][npm-url]
![npm bundle size](https://img.shields.io/bundlephobia/minzip/tolerant-json-parser)
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

A very tolerant JSON parser. It supports all the current JSON standard, along with the following tollerances added:

- Unquoted keys
- Single-quotes strings
- Multi-line template strings without interpolations (`some string`)
- Multi-line comments (/\* ... \*/)
- Single-line comments (// ...)
- Trailing commas

> ** Warning **
> This package does not work with Safari browser as [Safari still does not support lookbehind in JS regular expression](https://caniuse.com/js-regexp-lookbehind)

## Install

```bash
npm install tolerant-json-parser
```

## Usage

```ts
import { parse } from 'tolerant-json-parser';

parse(`
{
  
  [\`some template string without interpolation\`]: \`
    some multline template string
    without interpolation
  \`,/*
    some multiline comment
  */
  foo: 'bar',
  "baz": false, // some single-line comment
  'foo-baz': [1,2,3, ],
`);
```

[build-img]: https://github.com/jackardios/tolerant-json-parser/actions/workflows/release.yml/badge.svg
[build-url]: https://github.com/jackardios/tolerant-json-parser/actions/workflows/release.yml
[downloads-img]: https://img.shields.io/npm/dt/tolerant-json-parser
[downloads-url]: https://www.npmtrends.com/tolerant-json-parser
[npm-img]: https://img.shields.io/npm/v/tolerant-json-parser
[npm-url]: https://www.npmjs.com/package/tolerant-json-parser
[issues-img]: https://img.shields.io/github/issues/jackardios/tolerant-json-parser
[issues-url]: https://github.com/jackardios/tolerant-json-parser/issues
[semantic-release-img]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[commitizen-img]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
