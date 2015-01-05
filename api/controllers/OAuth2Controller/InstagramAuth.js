'use strict';
var User = require('../../models/User.js');
var authCredentials = require('../../../config/auth/index');
var InstagramStrategy  = require('passport-instagram').Strategy;
var chalk = require('chalk');
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
  passport.use(new InstagramStrategy({
      clientID: authCredentials.instagram.clientId,
      clientSecret: authCredentials.instagram.clientSecret,
      callbackURL: authCredentials.instagram.callbackURL,
      passReqToCallback: true
    }, function (req, token, refreshToken, profile, done) {
      process.nextTick(function() {
        // session has a user stored, use that
        // connect the instagram credentials to that account
        if (req.user) {
          // match session's stored user with db's user
          User.findOne({'_id': req.user._id}, function (err, user) {
            // return if error is thrown when connecting to db, etc
            if (err) {
              return done(err);
            }
            else {
              // if user haven't saved previous instagram credentials,
              // add it to the connected sessions user
              if (!user.socialmediaData.instagram.id) {
                user.socialmediaData.instagram.id = profile.id;
                user.socialmediaData.instagram.token = token;
                user.socialmediaData.instagram.username = profile.username;
                user.socialmediaData.instagram.full_name = profile.displayName;
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
              console.log(chalk.green('user found in session, instagram credentials:'), user);
            }
          });
        }
        else {
          // see if user exists in db,
          // if it does, use that
          // else, create new user
          User.findOne({ 'socialmediaData.instagram.id': profile.id }, function(err, user) {
            if (err) {
              return done(err);
            }
            // if the user is found,
            // log them in
            if (user) {
              return done(null, user);
            }
            // no user found, create new and save to db
            else {
              var newUser = new User();
              newUser.socialmediaData.instagram.id = profile.id;
              newUser.socialmediaData.instagram.token = token;
              newUser.socialmediaData.instagram.username = profile.username;
              newUser.socialmediaData.instagram.full_name = profile.displayName;
              newUser.save(function(err) {
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
  app.get('/auth/instagram', passport.authenticate('instagram', { scope: 'basic'}));
  app.get('/auth/instagram/callback', passport.authenticate('instagram', {
      successRedirect: '/connected',
      failureRedirect: '/'
    })
  );
};