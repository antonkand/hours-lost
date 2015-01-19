'use strict';
var User = require('../../models/User.js');
var authCredentials = require('../../../config/auth/index');
var TwitterStrategy = require('passport-twitter').Strategy;
var chalk = require('chalk');
var addTwitterCredentialsToUser = function (profile, token, existingUser) {
  var user = existingUser ? existingUser : new User();
  user.socialmediaData.twitter.id = profile.id;
  user.socialmediaData.twitter.token = token;
  user.socialmediaData.twitter.username = profile.username;
  user.socialmediaData.twitter.name = profile.displayName;
  return user;
};
/*
 * oauth2 login through Twitter
 * if no authed user is found in session or db, a new user is created
 * if user is found in db, that account is used
 * if user is found in session, that session's account is connected to twitter oauth
 * @param Express-app app: app to emit data
 * @param Socket.io connection io: the socket.io connection to use
 * @param Passport.MemoryStore.session session: session to use for checking existing user
 * @param Passport passport: the configured passport object to use
 * */
module.exports = function (app, socket, session, passport) {
  passport.use(new TwitterStrategy({
      consumerKey: authCredentials.twitter.consumer_key,
      consumerSecret: authCredentials.twitter.consumer_secret,
      callbackURL: authCredentials.twitter.callbackURL,
      passReqToCallback: false
    }, function (token, tokenSecret, profile, done) {
      process.nextTick(function () {
        // if user is found in session, save the twitter credentials to that db object
        // or use the credentials from that db object if twitter credentials are already stored
        if (session.passport.user) {
          console.log('user found in session');
          User.findOne({'_id': session.passport.user._id}, function (err, user) {
            // if err, throw it
            if (err) {
              throw err;
            }
            // if user is found in db and have twitter credentials, use that
            if (user && user.socialmediaData.twitter.id) {
              app.emit('get:userdata', { site: 'twitter', user: user });
              return done(null, user);
            }
            else {
              // add the twitter credentials to the existing user if user is found without credentials
              var existingUser = addTwitterCredentialsToUser(profile, token, user);
              existingUser.save(function (err, user) {
                if (err) {
                  throw err;
                }
                console.log(chalk.cyan('TwitterAuth: existing user extended with twitter credentials'));
                app.emit('get:userdata', { site: 'twitter', user: user });
                return done(null, user);
              });
            }
          });
        }
        // no user is found in session
        else {
          console.log('no user found in session');
          // check db for profile id returned
          User.findOne({'socialmediaData.twitter.id': profile.id}, function (err, user) {
            // if err, throw it
            if (err) {
              return done(err);
            }
            // if the user is found, auth
            if (user) {
              app.emit('get:userdata', { site: 'twitter', user: user });
              return done(null, user);
            }
            else {
              // if there is no user, create them
              var newUser = addTwitterCredentialsToUser(profile, token, null);
              // save our user into the database
              newUser.save(function (err, user) {
                if (err) {
                  throw err;
                }
                console.log(chalk.cyan('TwitterAuth: new user created'));
                app.emit('get:userdata', { site: 'twitter', user: user });
                return done(null, user);
              });
            }
          });
        }
      });
    })
  );
};

