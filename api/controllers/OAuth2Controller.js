// npm deps
var debug = require('debug');
var chalk = require('chalk');
var request = require('request');

// own deps
var User = require('../models/User.js');
var authCredentials = require('../../config/auth');
var TwitterStrategy  = require('passport-twitter').Strategy;
var middleware = require('../../lib/middleware/middleware.js');
module.exports = function (app, io, passport) {
  'use strict';
  io.emit('twitter:username', 'anton'); // TODO: Correct implementation

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  * all routes for oauths
  * first, redirect route for specific social media
  * then, callback route for same social media
  * @callbacks
  * authCredentials.<socialmedia>.redirect_uri follows this pattern
  * '/<socialmedia>/callback
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  passport.use(new TwitterStrategy({
      consumerKey: authCredentials.twitter.consumer_key,
      consumerSecret: authCredentials.twitter.consumer_secret,
      callbackURL: authCredentials.twitter.callback_url
    }, function (token, tokenSecret, profile, done) {
      // TODO: save profile to DB
      console.log(token);//User.save({})
      console.log(tokenSecret);
      console.log(profile);
      //io.emit('twitter:username', profile.username); // TODO: Correct implementation
      console.log(done());
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

  console.log(chalk.cyan('hours-lost ') + chalk.white('OAuth2Controller initialized.'));
};