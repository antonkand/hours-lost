'use strict';
var User = require('../../models/User.js');
var authCredentials = require('../../../config/auth/index');
var TwitterStrategy  = require('passport-twitter').Strategy;
module.exports = function (app, io, passport) {
  passport.use(new TwitterStrategy({
      consumerKey: authCredentials.twitter.consumer_key,
      consumerSecret: authCredentials.twitter.consumer_secret,
      callbackURL: authCredentials.twitter.callbackURL
    }, function (token, tokenSecret, profile, done) {
      process.nextTick(function() {
        console.log('inside nexttick');
        User.findOne({ 'socialmediaData.twitter.id': profile.id }, function(err, user) {
          console.log(user.socialmediaData.twitter.id);
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
            newUser.socialmediaData.twitter.id = profile.id;
            newUser.socialmediaData.twitter.token = token;
            newUser.socialmediaData.twitter.username = profile.username;
            newUser.socialmediaData.twitter.displayName = profile.displayName;
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
  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
      failureRedirect: '/'
    }),
    function(req, res) {
      // Successful authentication, redirect to connected state.
      res.redirect('/connected');
    });
};