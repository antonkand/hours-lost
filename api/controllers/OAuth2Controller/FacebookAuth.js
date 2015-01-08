'use strict';
var User = require('../../models/User.js');
var authCredentials = require('../../../config/auth/index');
var chalk = require('chalk');
var FacebookStrategy  = require('passport-facebook').Strategy;
var createNewFacebookUser = function (profile, token) {
  var user = new User();
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
 * @param Express Server app: which app to hook the login to
 * @param Socket.io connection io: the socket.io connection to use
 * @param Passport.MemoryStore sessionStore: custom sessionstore for passport
 * @param String sid: session id to use with sessionStore
 * @param Passport passport: the configured passport object to use
 * */
module.exports = function (app, socket, sessionStore, sid, passport) {
  socket.emit('facebook:connected', true);
  passport.use(new FacebookStrategy({
      clientID: authCredentials.facebook.clientId,
      clientSecret: authCredentials.facebook.clientSecret,
      callbackURL: authCredentials.facebook.callbackURL,
      passReqToCallback: false
    }, function (token, tokenSecret, profile, done) {
      process.nextTick(function() {
        console.log(sid);
        sessionStore.get(sid, function (err, session ) {
          if (err) {
            throw err;
          }
          if (!session) {
            User.findOne({ 'socialmediaData.facebook.id': profile.id }, function(err, user) {
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
                var newUser = createNewFacebookUser(profile, token);
                console.log(chalk.green('FacebookAuth: new user created', newUser));
                // save our user into the database
                newUser.save(function(err) {
                  if (err) {
                    throw err;
                  }
                  return done(null, newUser);
                });
              }
            });
          }
          else {
            if (session.passport.user) {
              console.log(chalk.green('TwitterAuth: session found'));
              console.log(session.passport.user);
              // match session's stored user with db's user
              User.findOne({'_id': session.passport.user._id}, function (err, user) {
                // return if error is thrown when connecting to db, etc
                if (err) {
                  return done(err);
                }
                else {
                  // if user haven't saved previous twitter credentials,
                  // add it to the connected sessions user
                  if (user === null || !user.socialmediaData.facebook.id) {
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
                  console.log(chalk.green('FacebookAuth: user found in session, twitter credentials:\n'), user);
                }
              });
            }
          }
        });
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