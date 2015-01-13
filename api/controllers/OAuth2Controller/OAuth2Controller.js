'use strict';
// own deps
var chalk = require('chalk');
var User = require('../../models/User.js');
module.exports = function (app, socket, passport, session) {
  var storeUser = function (user) {
    console.log('user');
    console.log(user);
  };
  // serialize the user into session
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  // deserialize the user out of session
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
  require('./TwitterAuth.js')(socket, session, passport, storeUser);
  require('./FacebookAuth.js')(socket, session, passport, storeUser);
  require('./GooglePlusAuth.js')(socket, session, passport, storeUser);
  require('./InstagramAuth.js')(socket, session, passport, storeUser);
};
