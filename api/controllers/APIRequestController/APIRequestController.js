'use strict';
// npm deps
var debug = require('debug');
var chalk = require('chalk');

// lib deps
var TwitterRequestService = require('./TwitterRequestService.js');
var FacebookRequestService = require('./FacebookRequestService.js');

module.exports = function (app, socket) {
  app.on('get:userdata', function (data) {
    if (data[0] === 'twitter') {
      console.log(
        chalk.green('get:userdata ') + chalk.white('user authed against twitter:\n' + data[1].socialmediaData.twitter));
    }
  });
  //app.get('/socialdata/twitter', function (req, res) {
  //  TwitterRequestService(req, res);
  //});
  //app.get('/socialdata/facebook', function (req, res) {
  //  FacebookRequestService(req, res);
  //});
};