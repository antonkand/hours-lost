// own deps
var User = require('../../models/User.js');

module.exports = function (app, socket, sessionStore, sid, passport) {
  'use strict';
  // serialize the user into session
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  // deserialize the user out of session
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  require('./TwitterAuth.js')(app, socket, sessionStore, sid, passport);
  require('./FacebookAuth.js')(app, socket, sessionStore, sid, passport);
  //require('./GooglePlusAuth.js')(app, socket, sessionStore, sid, passport);
  require('./InstagramAuth.js')(app, socket, sessionStore, sid, passport);
};