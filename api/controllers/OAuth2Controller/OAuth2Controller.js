// npm deps
var debug = require('debug');
var chalk = require('chalk');
var request = require('request');

// own deps
var User = require('../../models/User.js');

module.exports = function (app, io, passport) {
  'use strict';
  var twitterSocket = io.of('/hours-lost/twitter');
  var facebookSocket = io.of('/hours-lost/facebook');
  var googleSocket = io.of('/hours-lost/google');
  var instagramSocket = io.of('/hours-lost/instagram');

  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  // used to deserialize the user
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
  require('./TwitterAuth.js')(app, twitterSocket, passport);
  require('./FacebookAuth.js')(app, io, passport);
  require('./GooglePlusAuth.js')(app, io, passport);
  require('./InstagramAuth.js')(app, io, passport);
  console.log(chalk.cyan('hours-lost ') + chalk.white('OAuth2Controller initialized.'));
};