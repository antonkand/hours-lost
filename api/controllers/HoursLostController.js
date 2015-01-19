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

/* * * * * * * * * * * * * * * * * * * * * * * * * *
 * main controller                                 *
 * all child controllers are found inside of it    *
 * configures passport, and handles session        *
 * @param Express app: app to configure and use    *
 * @param Socket.io io: socket connection to use   *
 * * * * * * * * * * * * * * * * * * * * * * * * * */
module.exports = function (app, io) {
  app.use(cookieParser());
  app.use(session({
    cookie: {httpOnly: false},
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

  /* * * * * * * * * * * * * * * * * * * *
   * all socket.io events happens here   *
   * * * * * * * * * * * * * * * * * * * */
  io.of('/hours-lost').on('connection', function RealTimeController (socket) {
    this.user = null;
    this.session = null;
    this.sid = null;
    var that = this;
    socket.on('all:session', function (cookie) {
      that.sid = cookie.substring(16, 48); // substring of sid
      console.log('all:session');
      sessionStore.get(that.sid, function (err, session) {
          if (err || !session) {
            console.log('no session found');
            OAuth2Controller(app, socket, session, passport);
          }
          else {
            console.log('session found');
            that.session = session;
            OAuth2Controller(app, socket, session, passport);
          }
        });
    });
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
      if (that.session && that.session.passport.user) {
        var user = {};
        user.user = Object.keys(that.session.passport.user.socialmediaData).map(function (socialmedia) {
          console.log(that.session.passport.user.socialmediaData[socialmedia].name);
          return {
            name: that.session.passport.user.socialmediaData[socialmedia].name,
            media: socialmedia,
            id: that.session.passport.user._id
          };
        });
        socket.emit('all:user', user);
      }
    });
    socket.on('get:twitter', function (data) {
      console.log('get:twitter');
      console.log(data);
    });
    socket.on('get:google', function (data) {
      console.log('get:google');
      console.log(data);
    });
    socket.on('get:facebook', function (data) {
      console.log('get:facebook');
      console.log(data);
    });
    socket.on('get:instagram', function (data) {
      console.log('get:instagram');
      console.log(data);
    });
  });
};
