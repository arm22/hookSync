var
  co = require('co'),
  fs = require('fs'),
  https = require('https'),
  koa = require('koa'),
  renege = require('../promise.js');

const PORT = 8080;


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
    server.listen(process.env.NODE_PORT || PORT);
    console.log('secure server started...');
  });

  return app;
}());
