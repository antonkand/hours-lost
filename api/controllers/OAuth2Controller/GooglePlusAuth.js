'use strict';
var User = require('../../models/User.js');
var authCredentials = require('../../../config/auth/index');
var chalk = require('chalk');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var addGoogleCredentialsToUser = function (profile, token, existingUser) {
  var user = existingUser ? existingUser : new User();
  user.socialmediaData.google.id = profile.id;
  user.socialmediaData.google.token = token;
  user.socialmediaData.google.name = profile.displayName;
  user.socialmediaData.google.email = profile.emails[0].value;
  return user;
};
/*
 * oauth2 login through Google
 * if no authed user is found in session or db, a new user is created
 * if user is found in db, that account is used
 * if user is found in session, that session's account is connected to google oauth
 * @param Socket.io connection io: the socket.io connection to use
 * @param Passport passport: the configured passport object to use
 * */
module.exports = function (socket, session, passport) {
  socket.emit('google:connected', true);
  passport.use(new GoogleStrategy({
      clientID: authCredentials.google.clientId,
      clientSecret: authCredentials.google.clientSecret,
      callbackURL: authCredentials.google.callbackURL,
      passReqToCallback: false
    }, function (token, tokenSecret, profile, done) {
      process.nextTick(function () {
        // if user is found in session, save the google credentials to that db object
        // or use the credentials from that db object if google credentials are already stored
        if (session.passport.user) {
          console.log('user found in session');
          console.log(session.passport.user);
          User.findOne({'_id': session.passport.user._id}, function (err, user) {
            // if err, throw it
            if (err) {
              throw err;
            }
            // if user is found in db and have google credentials, use that
            if (user && user.socialmediaData.google.id) {
              return done(null, user);
            }
            else {
              // add the google credentials to the existing user if user is found without credentials
              var existingUser = addGoogleCredentialsToUser(profile, token, user);
              existingUser.save(function (err, user) {
                if (err) {
                  throw err;
                }
                console.log(chalk.green('GoogleAuth: existing user extended with google credentials', user));
                return done(null, user);
              });
            }
          });
        }
        // no user is found in session
        else {
          console.log('no user found in session');
          // check db for profile id
          User.findOne({'socialmediaData.google.id': profile.id}, function (err, user) {
            // if err, throw it
            if (err) {
              return done(err);
            }
            // if the user is found, auth
            if (user) {
              return done(null, user);
            }
            else {
              // if there is no user, create them
              var newUser = addGoogleCredentialsToUser(profile, token, null);
              // save our user into the database
              newUser.save(function (err, user) {
                if (err) {
                  throw err;
                }
                console.log(chalk.green('GoogleAuth: new user created', user));
                return done(null, user);
              });
            }
          });
        }
      });
    })
  );
};
