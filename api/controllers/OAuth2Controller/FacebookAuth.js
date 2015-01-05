'use strict';
var User = require('../../models/User.js');
var authCredentials = require('../../../config/auth/index');
var chalk = require('chalk');
var FacebookStrategy  = require('passport-facebook').Strategy;
/*
 * oauth2 login through Facebook
 * if no authed user is found in session or db, a new user is created
 * if user is found in db, that account is used
 * if user is found in session, that session's account is connected to facebook ouath
 * @param Express Server app: which app to hook the login to
 * @param Socket.io connection io: the socket.io connection to use
 * @param Passport passport: the configured passport object to use
 * */
module.exports = function (app, io, passport) {
  passport.use(new FacebookStrategy({
      clientID: authCredentials.facebook.clientId,
      clientSecret: authCredentials.facebook.clientSecret,
      callbackURL: authCredentials.facebook.callbackURL,
      passReqToCallback: true
    }, function (req ,token, refreshToken, profile, done) {
      process.nextTick(function() {
        if (req.user) {
          // match session's stored user with db's user
          User.findOne({'_id': req.user._id}, function (err, user) {
            // return if error is thrown when connecting to db, etc
            if (err) {
              return done(err);
            }
            else {
              // if user haven't saved previous facebook credentials,
              // add it to the connected sessions user
              if (!user.socialmediaData.facebook.id) {
                user.socialmediaData.facebook.id = profile.id;
                user.socialmediaData.facebook.token = token;
                user.socialmediaData.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                user.socialmediaData.facebook.email = profile.emails[0].value;
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
              console.log(chalk.green('user found in session, facebook credentials:\n'), user);
            }
          });
        }
        else {
          User.findOne({'socialmediaData.facebook.id': profile.id}, function (err, user) {
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
              var newUser = new User();
              console.log(newUser);
              // set all of the user data that we need
              newUser.socialmediaData.facebook.id = profile.id;
              newUser.socialmediaData.facebook.token = token;
              newUser.socialmediaData.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
              newUser.socialmediaData.facebook.email = profile.emails[0].value;
              // save our user into the database
              newUser.save(function (err) {
                if (err) {
                  throw err;
                }
                return done(null, newUser);
              });
            }
          });
        }
      });
    }
  ));
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * routes for OAuths
   * @callback follows the pattern '/<socialmedia>/callback'
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email'}));
  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/connected',
    failureRedirect: '/'
    })
  );
};