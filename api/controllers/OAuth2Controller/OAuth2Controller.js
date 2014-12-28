// npm deps
var debug = require('debug');
var chalk = require('chalk');
var request = require('request');

// own deps
var User = require('../../models/User.js');

module.exports = function (app, io, passport) {
  'use strict';
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  // used to deserialize the user
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
  require('./TwitterAuth.js')(app, io, passport);
  require('./FacebookAuth.js')(app, io, passport);
  console.log(chalk.cyan('hours-lost ') + chalk.white('OAuth2Controller initialized.'));
};