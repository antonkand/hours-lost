'use strict';
var chalk = require('chalk');
var debug = require('debug');
var passport = require('passport');
var config = require('../../config/hourslost_config.js');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');
var sessionStore = new session.MemoryStore;
var OAuth2Controller = require('./OAuth2Controller/OAuth2Controller.js');
var RequestController = require('./APIRequestController/APIRequestController.js');
var User = require('../models/User.js');
/*
 * main controller
 * all child controllers are found inside of it
 * configures passport, and handles session
 * @param Express app: app to configure and use
 * @param Socket.io io: socket connection to use */
module.exports = function (app, io) {
    app.use(session({
      cookie: { httpOnly: false },
      secret: config.secretString,
      resave: true,
      saveUninitialized: true,
      store: sessionStore
    }));
    app.use(passport.initialize());
    app.use(flash());
    app.get('/', function (req, res) {
        res.render('index');
    });
    app.get('/connected', function (req, res) {
       res.render('spa');
    });
    /*
    * all socket.io events happens here
    * */

  io.of('/hours-lost').on('connection', function RealTimeController (socket) {
    this.user = null;
    var that = this;
    socket.on('all:session', function (cookie) {
      var sid = cookie.substring(16, 48); // substring of sid
      console.log('all:session');
      sessionStore.get(sid, function(err, session) {
        if (err || !session) {
          console.log('no session found');
          console.log(session);
        }
        else {
          if (session.passport.user) {
            that.user  = session.passport.user;
            console.log(that.user);
          }
        }
      });
    });
    OAuth2Controller(app, socket, passport); // handles all OAuths
    RequestController(app, socket); // handles all GETs to external API
    // socket connected, celebrate!
    socket.emit('socket:connection', 'hours-lost-server: socket successfully connected.');
    // log the connected socket
    socket.on('socket:connection', function (data) {
      console.log(chalk.green(data));
    });
    // retrieve authed users from db
    socket.on('all:user', function () {
      console.log('all:user');
      var userWithOutTokens = null;
      if (that.user) {
        userWithOutTokens = Object.keys(that.user.socialmediaData).map(function (socialmedia) {
          return that.user.socialmediaData[socialmedia].name;
        });
      }
      socket.emit('all:user', userWithOutTokens);
    });
  });
};