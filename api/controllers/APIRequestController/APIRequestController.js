'use strict';
// npm deps
var debug = require('debug');
var chalk = require('chalk');
var request = require('request');

module.exports = function (app) {
  app.get('/socialdata/twitter', function (req, res) {
    request('https://api.twitter.com/1.1/users/show.json', function (error, response, body) {
      console.log(error);
      console.log(response);
      console.log(body);
      if (!error && response.statusCode === 200) {
        console.log(body);
      }
    });
  });
};