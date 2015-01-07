// npm deps
var debug = require('debug');
var chalk = require('chalk');

// own deps
var User = require('../../models/User.js');

module.exports = function (app, socket, passport) {
  'use strict';
  // serialize the user into session
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  // deserialize the user out of session
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
  require('./TwitterAuth.js')(app, socket, passport);
  require('./FacebookAuth.js')(app, socket, passport);
  require('./GooglePlusAuth.js')(app, socket, passport);
  require('./InstagramAuth.js')(app, socket, passport);
};