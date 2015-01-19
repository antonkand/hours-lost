'use strict';
// own deps
var chalk = require('chalk');
var User = require('../../models/User.js');
module.exports = function (app, socket, session, passport) {
  // serialize the user into session
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  // deserialize the user out of session
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
  //* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // * routes for OAuths                                        *
  // * @callback follows the pattern '/<socialmedia>/callback'  *
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

  // twitter
  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
      failureRedirect: '/'
    }),
    function (req, res) {
      res.redirect('/connected');
    });
  // instagram
  app.get('/auth/instagram', passport.authenticate('instagram', {scope: 'basic'}));
  app.get('/auth/instagram/callback', passport.authenticate('instagram', {
      failureRedirect: '/'
    }),
    function (req, res) {
      res.redirect('/connected');
    });
  // facebook
  app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
      failureRedirect: '/'
    }),
    function (req, res) {
      res.redirect('/connected');
    });
  // google
  app.get('/auth/google', passport.authenticate('google', {scope: ['email', 'profile']}));
  app.get('/auth/google/callback', passport.authenticate('google', {
      failureRedirect: '/'
    }),
    function (req, res) {
      res.redirect('/connected');
    });
  require('./TwitterAuth.js')(app, socket, session, passport);
  require('./FacebookAuth.js')(app, socket, session, passport);
  require('./GooglePlusAuth.js')(socket, session, passport);
  require('./InstagramAuth.js')(app, socket, session, passport);
};
