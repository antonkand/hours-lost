// npm deps
var debug = require('debug');
var chalk = require('chalk');

// own deps
var User = require('../../models/User.js');

module.exports = function (app, socket, passport) {
  'use strict';
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  // used to deserialize the user
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
  require('./TwitterAuth.js')(app, socket, passport);
  require('./FacebookAuth.js')(app, socket, passport);
  require('./GooglePlusAuth.js')(app, socket, passport);
  require('./InstagramAuth.js')(app, socket, passport);
  console.log(chalk.cyan('hours-lost ') + chalk.white('OAuth2Controller initialized.'));
};