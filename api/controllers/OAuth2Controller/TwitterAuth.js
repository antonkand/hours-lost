'use strict';
var chalk = require('chalk');

var User = require('../../models/User.js');
//console.log(User);
//User.save({
//  id: 123,
//  twitterId: 'ididid'
//});

var authCredentials = require('../../../config/auth/index');
var TwitterStrategy  = require('passport-twitter').Strategy;
var middleware = require('../../../lib/middleware/middleware.js');

module.exports = function (app, io, passport) {
  //passport.serializeUser(function(user, done) {
  //  done(null, user.id);
  //});
  //
  //// used to deserialize the user
  //passport.deserializeUser(function(id, done) {
  //  User.findById(id, function(err, user) {
  //    done(err, user);
  //  });
  //});
  io.of('/hours-lost/twitter').on('connection', function (socket) {
    socket.emit('twitter:username', 'anton'); // TODO: Correct implementation
  });

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
      // TODO: correct instantion of Mongoose model
      // TODO: TypeError: Object function model(doc, fields, skipId) {
      // TODO: if (!(this instanceof model))
      // TODO:   return new model(doc, fields, skipId);
      // TODO:  Model.call(this, doc, fields, skipId);
      // TODO: } has no method 'save'
      console.log('User outside callback');

      console.log(User);
      User.save({ twitterId: profile.id }, function (err, user) {
        console.log('user inside callback');

        console.log(user);
        return done(err, user);
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