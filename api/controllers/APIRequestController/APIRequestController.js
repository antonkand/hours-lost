'use strict';
// npm deps
var debug = require('debug');
var chalk = require('chalk');

// lib deps
var TwitterRequestService = require('./TwitterRequestService.js');
var FacebookRequestService = require('./FacebookRequestService.js');

module.exports = function (app) {
  app.get('/socialdata/twitter', function (req, res) {
    TwitterRequestService(req, res);
  });
  app.get('/socialdata/facebook', function (req, res) {
    FacebookRequestService(req, res);
  });
};