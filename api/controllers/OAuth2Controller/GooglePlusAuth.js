'use strict';
var User = require('../../models/User.js');
var appURL = require('../../../config/url.js');
var authCredentials = require('../../../config/auth/index');
var GoogleStrategy  = require('passport-google-oauth').OAuth2Strategy;
module.exports = function (app, io, passport) {
  passport.use(new GoogleStrategy({
      clientID: authCredentials.google.clientId,
      clientSecret: authCredentials.google.clientSecret,
      callbackURL: authCredentials.google.callbackURL
    }, function (token, refreshToken, profile, done) {
      process.nextTick(function() {
        console.log('inside nexttick');
        User.findOne({ 'socialmediaData.google.id': profile.id }, function(err, user) {
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
            newUser.socialmediaData.google.id = profile.id;
            newUser.socialmediaData.google.token = token;
            newUser.socialmediaData.google.name = profile.displayName;
            newUser.socialmediaData.google.email = profile.emails[0].value;
            // save our user into the database
            newUser.save(function(err) {
              if (err) {
                throw err;
              }
              return done(null, newUser);
            });
          }
        });

      });
    }
  ));
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * routes for OAuths
   * @callback follows the pattern '/<socialmedia>/callback'
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile']}));
  app.get('/auth/google/callback', passport.authenticate('google', {
      successRedirect: '/connected',
      failureRedirect: '/'
    })
  );
};