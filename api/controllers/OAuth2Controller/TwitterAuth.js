'use strict';
var User = require('../../models/User.js');
var authCredentials = require('../../../config/auth/index');
var TwitterStrategy  = require('passport-twitter').Strategy;
var chalk = require('chalk');
var createNewTwitterUser = function (profile, token) {
  var user = new User();
  user.socialmediaData.twitter.id = profile.id;
  user.socialmediaData.twitter.token = token;
  user.socialmediaData.twitter.username = profile.username;
  user.socialmediaData.twitter.displayName = profile.displayName;
  return user;
};

/*
 * oauth2 login through Instagram
 * if no authed user is found in session or db, a new user is created
 * if user is found in db, that account is used
 * if user is found in session, that session's account is connected to instagram ouath
 * @param Express Server app: which app to hook the login to
 * @param Socket.io connection io: the socket.io connection to use
 * @param Passport passport: the configured passport object to use
 * */
module.exports = function (app, io, passport) {
  passport.use(new TwitterStrategy({
      consumerKey: authCredentials.twitter.consumer_key,
      consumerSecret: authCredentials.twitter.consumer_secret,
      callbackURL: authCredentials.twitter.callbackURL,
      passReqToCallback: true
    }, function (req, token, tokenSecret, profile, done) {
      process.nextTick(function() {
        if (req.user) {
          // match session's stored user with db's user
          User.findOne({'_id': req.user._id}, function (err, user) {
            // return if error is thrown when connecting to db, etc
            if (err) {
              return done(err);
            }
            else {
              // if user haven't saved previous twitter credentials,
              // add it to the connected sessions user
              if (user === null || !user.socialmediaData.facebook.id) {
                user.socialmediaData.twitter.id = profile.id;
                user.socialmediaData.twitter.token = token;
                user.socialmediaData.twitter.username = profile.username;
                user.socialmediaData.twitter.displayName = profile.displayName;
                user.save(function (err) {
                  if (err) {
                    throw err;
                  }
                  else {
                    return done(null, user);
                  }
                });
              }
              // user is already in db, use that account
              else {
                return done(null, user);
              }
              console.log(chalk.green('user found in session, twitter credentials:\n'), user);
            }
          });
        }
        else {
          User.findOne({ 'socialmediaData.twitter.id': profile.id }, function(err, user) {
          // if there is an error, stop everything and return that
          // ie an error connecting to the database
          if (err) {
            return done(err);
          }
          // if the user is found then log them in
          if (user) {
            return done(null, user); // user found, return that user
          } else {
            // if there is no user, create them
            var newUser = createNewTwitterUser(profile, token);
            console.log(newUser);
            // save our user into the database
            newUser.save(function(err) {
              if (err) {
                throw err;
              }
              return done(null, newUser);
            });
          }
        });}

      });
    }
  ));
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * routes for OAuths
   * @callback follows the pattern '/<socialmedia>/callback'
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
      failureRedirect: '/'
    }),
    function(req, res) {
      // Successful authentication, redirect to connected state.
      res.redirect('/connected');
    });
};