'use strict';
var User = require('../../models/User.js');
var authCredentials = require('../../../config/auth/index');
var chalk = require('chalk');
var FacebookStrategy = require('passport-facebook').Strategy;
var addFacebookCredentialsToUser = function (profile, token, existingUser) {
  var user = existingUser ? existingUser : new User();
  user.socialmediaData.facebook.id = profile.id;
  user.socialmediaData.facebook.token = token;
  user.socialmediaData.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
  user.socialmediaData.facebook.email = profile.emails[0].value;
  return user;
};
/*
 * oauth2 login through Facebook
 * if no authed user is found in session or db, a new user is created
 * if user is found in db, that account is used
 * if user is found in session, that session's account is connected to facebook oauth
 * @param Express-app app: app to emit data
 * @param Socket.io connection io: the socket.io connection to use
 * @param Passport.MemoryStore.session session: session to use for checking existing user
 * @param Passport passport: the configured passport object to use
 * */
module.exports = function (app, socket, session, passport) {
  passport.use(new FacebookStrategy({
      clientID: authCredentials.facebook.clientId,
      clientSecret: authCredentials.facebook.clientSecret,
      callbackURL: authCredentials.facebook.callbackURL,
      passReqToCallback: false
    }, function (token, tokenSecret, profile, done) {
      process.nextTick(function () {
        // if user is found in session, save the facebook credentials to that db object
        // or use the credentials from that db object if facebook credentials are already stored
        if (session.passport.user) {
          console.log('user found in session');
          User.findOne({'_id': session.passport.user._id}, function (err, user) {
            // if err, throw it
            if (err) {
              throw err;
            }
            // if user is found in db and have facebook credentials, use that
            if (user && user.socialmediaData.facebook.id) {
              app.emit('get:userdata', { site: 'facebook', user: user });
              return done(null, user);
            }
            else {
              // add the facebook credentials to the existing user if user is found without credentials
              var existingUser = addFacebookCredentialsToUser(profile, token, user);
              existingUser.save(function (err, user) {
                if (err) {
                  throw err;
                }
                console.log(chalk.green('FacebookAuth: existing user extended with facebook credentials'));
                app.emit('get:userdata', { site: 'facebook', user: user });
                return done(null, user);
              });
            }
          });
        }
        // no user is found in session
        else {
          console.log('no user found in session');
          // check db for profile id returned
          User.findOne({'socialmediaData.facebook.id': profile.id}, function (err, user) {
            // if err, throw it
            if (err) {
              return done(err);
            }
            // if the user is found, auth
            if (user) {
              app.emit('get:userdata', { site: 'facebook', user: user });
              return done(null, user);
            }
            else {
              // if there is no user, create them
              var newUser = addFacebookCredentialsToUser(profile, token, null);
              // save our user into the database
              newUser.save(function (err, user) {
                if (err) {
                  throw err;
                }
                console.log(chalk.green('FacebookAuth: new user created'));
                app.emit('get:userdata', { site: 'facebook', user: user });
                return done(null, user);
              });
            }
          });
        }
      });
    })
  );
};
