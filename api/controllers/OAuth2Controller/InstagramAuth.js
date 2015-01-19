'use strict';
var User = require('../../models/User.js');
var authCredentials = require('../../../config/auth/index');
var InstagramStrategy = require('passport-instagram').Strategy;
var chalk = require('chalk');
var addCredentialsToInstagramUser = function (profile, token, existingUser) {
  var user = existingUser ? existingUser : new User();
  user.socialmediaData.instagram.id = profile.id;
  user.socialmediaData.instagram.token = token;
  user.socialmediaData.instagram.username = profile.username;
  user.socialmediaData.instagram.name = profile.displayName;
  return user;
};
/*
 * oauth2 login through Instagram
 * if no authed user is found in session or db, a new user is created
 * if user is found in db, that account is used
 * if user is found in session, that session's account is connected to instagram oauth
 * @param Express-app app: app to emit data
 * @param Socket.io connection io: the socket.io connection to use
 * @param Passport.MemoryStore.session session: session to use for checking existing user
 * @param Passport passport: the configured passport object to use
 * */
module.exports = function (app, socket, session, passport) {
  passport.use(new InstagramStrategy({
      clientID: authCredentials.instagram.clientId,
      clientSecret: authCredentials.instagram.clientSecret,
      callbackURL: authCredentials.instagram.callbackURL,
      passReqToCallback: false
    }, function (token, tokenSecret, profile, done) {
      process.nextTick(function () {
        // if user is found in session, save the google credentials to that db object
        // or use the credentials from that db object if google credentials are already stored
        if (session.passport.user) {
          console.log('user found in session');
          User.findOne({'_id': session.passport.user._id}, function (err, user) {
            // if err, throw it
            if (err) {
              throw err;
            }
            // if user is found in db and have instagram credentials, use that
            if (user && user.socialmediaData.instagram.id) {
              app.emit('get:userdata', { site: 'instagram', user: user });
              return done(null, user);
            }
            else {
              // add the instagram credentials to the existing user if user is found without credentials
              var existingUser = addCredentialsToInstagramUser(profile, token, user);
              existingUser.save(function (err, user) {
                if (err) {
                  throw err;
                }
                console.log(chalk.green('InstagramAuth: existing user extended with instagram credentials'));
                app.emit('get:userdata', { site: 'instagram', user: user });
                return done(null, user);
              });
            }
          });
        }
        // no user is found in session
        else {
          console.log('no user found in session');
          // check db for profile id
          User.findOne({'socialmediaData.instagram.id': profile.id}, function (err, user) {
            // if err, throw it
            if (err) {
              return done(err);
            }
            // if the user is found, auth
            if (user) {
              app.emit('get:userdata', { site: 'instagram', user: user });
              return done(null, user);
            }
            else {
              // if there is no user, create them
              var newUser = addCredentialsToInstagramUser(profile, token, null);
              // save our user into the database
              newUser.save(function (err, user) {
                if (err) {
                  throw err;
                }
                console.log(chalk.green('InstagramAuth: new user created'));
                app.emit('get:userdata', { site: 'instagram', user: user });
                return done(null, user);
              });
            }
          });
        }
      });
    })
  );
};
