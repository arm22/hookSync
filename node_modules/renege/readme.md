# Renege

[![Build Status](https://travis-ci.org/brozeph/renege.svg)](https://travis-ci.org/brozeph/renege)
[![Coverage Status](https://coveralls.io/repos/github/brozeph/renege/badge.svg?branch=master)](https://coveralls.io/github/brozeph/renege?branch=master)

Simple Node.js library to turn a typical callback function into a native ES6 Promise.

## Installation

```bash
npm install renege
```

## Prerequisites

Node.js `v0.12` or greater is required. If using version `v0.12` of Node, be sure to run node with the `--harmony` flag specified.

```
node --harmony /path/to/your/app
```

## Usage

This module exposes two methods:

### renege.create

This method accepts a range of arguments for a method that has a callback following the typical `callback(err, resultX, resultY, etc)` method signature. To call use this function, supply the `function`, `arg1`, `arg2`, etc. as arguments.

```javascript
var readPackageJsonFile = renege.create(fs.readFile, './package.json', { encoding : 'utf8' });

readPackageJsonFile.then(function (contents) {
  console.log(contents);
});
```

### renege.promisify

This method accepts a single argument that is a function with a callback. This method is useful when creating a promise where you want to have flexibility in terms of what arguments you supply when calling it.

```javascript
var readFile = renege.promisify(fs.readFile);
```

Example:

```javascript
var
  co = require('co'),
  fs = require('fs'),
  https = require('https'),
  koa = require('koa'),
  renege = require('../promise.js');


module.exports = (function () {
  'use strict';

  var
    app = koa(),
    readFile = renege.promisify(fs.readFile),
    server;

  co(function *() {
    var options = {
      cert : yield readFile('/path/to/server.crt', { encoding : 'utf8'}),
      key : yield readFile('/path/to/server.key', { encoding : 'utf8' })
    };

    server = https.createServer(options, app.callback());
  }).catch(function (err) {
    console.error(err);
  }).then(function () {
    server.listen(process.env.NODE_PORT || 8080);
    console.log('secure server started...');
  });

  return app;
}());
```

### renege.series

This method accepts a list of functions, each returning a Promise, and executes each one in the order that they appear within the list.

```javascript
var list = [
  function () {
    console.log(1);
    return setTimeout(Promise.resolve, 1000);
  },
  function () {
    console.log(2);
    return Promise.resolve();
  },
  function () {
    console.log(3);
    return setTimeout(Promise.resolve, 500);
  }
];

renege
  .series(list)
  .then(() => {
    // complete!
    // will output the console.log commands above in order!
  })
  .catch((err) => {
    // handle any errors...
  });
```
