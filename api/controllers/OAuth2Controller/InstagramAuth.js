'use strict';
var User = require('../../models/User.js');
var authCredentials = require('../../../config/auth/index');
var InstagramStrategy  = require('passport-instagram').Strategy;
module.exports = function (app, io, passport) {
  passport.use(new InstagramStrategy({
      clientID: authCredentials.instagram.clientId,
      clientSecret: authCredentials.instagram.clientSecret,
      callbackURL: authCredentials.instagram.callbackURL
    }, function (token, refreshToken, profile, done) {
      process.nextTick(function() {
        console.log('inside nexttick');
        User.findOne({ 'socialmediaData.instagram.id': profile.id }, function(err, user) {
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
            // set all of the user data that we need
            newUser.socialmediaData.instagram.id = profile.id;
            newUser.socialmediaData.instagram.token = token;
            newUser.socialmediaData.instagram.username = profile.username;
            newUser.socialmediaData.instagram.full_name = profile.displayName;
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
  app.get('/auth/instagram', passport.authenticate('instagram', { scope: 'basic'}));
  app.get('/auth/instagram/callback', passport.authenticate('instagram', {
      successRedirect: '/connected',
      failureRedirect: '/'
    })
  );
};