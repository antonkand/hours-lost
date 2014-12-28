'use strict';
var chalk = require('chalk');

var User = require('../../models/User.js');
var authCredentials = require('../../../config/auth/index');
var TwitterStrategy  = require('passport-twitter').Strategy;
var middleware = require('../../../lib/middleware/middleware.js');

module.exports = function (app, io, passport) {
  io.of('/hours-lost/twitter').on('connection', function (socket) {
    socket.emit('twitter:user', 'username');
  });
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * all routes for oauths
   * first, redirect route for specific social media
   * then, callback route for same social media
   * @callbacks
   * authCredentials.<socialmedia>.redirect_uri follows this pattern
   * '/<socialmedia>/callback
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  // used to deserialize the user
  passport.deserializeUser(function(user, done) {
      done(null, user);
  });
   passport.use(new TwitterStrategy({
      consumerKey: authCredentials.twitter.consumer_key,
      consumerSecret: authCredentials.twitter.consumer_secret,
      callbackURL: authCredentials.twitter.callback_url
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
  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
      failureRedirect: '/'
    }),
    function(req, res) {
      // Successful authentication, redirect to connected state.
      console.log(chalk.cyan('hours-lost: ') + chalk.green('/auth/twitter/callback: success, user is logged in'));
      res.redirect('/connected');
    });
};