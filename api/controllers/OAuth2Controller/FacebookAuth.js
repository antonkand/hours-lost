'use strict';
var User = require('../../models/User.js');
var appURL = require('../../../config/url.js');
var authCredentials = require('../../../config/auth/index');
var FacebookStrategy  = require('passport-facebook').Strategy;
module.exports = function (app, io, passport) {
  passport.use(new FacebookStrategy({
      clientID: authCredentials.facebook.clientId,
      clientSecret: authCredentials.facebook.clientSecret,
      callbackURL: authCredentials.facebook.callbackURL
    }, function (token, refreshToken, profile, done) {
      process.nextTick(function() {
        console.log('inside nexttick');
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
            var newUser = new User();
            console.log(newUser);
            // set all of the user data that we need
            newUser.socialmediaData.facebook.id = profile.id;
            newUser.socialmediaData.facebook.token = token;
            newUser.socialmediaData.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
            newUser.socialmediaData.facebook.email = profile.emails[0].value;
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
  app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email'}));
  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/connected',
    failureRedirect: '/'
    })
  );
};