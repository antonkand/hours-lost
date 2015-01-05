'use strict';
// npm deps
var debug = require('debug');
var chalk = require('chalk');

// lib deps
var TwitterRequestService = require('./TwitterRequestService.js');
module.exports = function (app) {
  app.get('/socialdata/twitter', function (req, res) {
    TwitterRequestService(req, res);
  });
};