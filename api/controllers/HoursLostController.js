'use strict';
var chalk = require('chalk');
var debug = require('debug');
var OAuth2Controller = require('./OAuth2Controller/OAuth2Controller.js');
var RequestController = require('./APIRequestController/APIRequestController.js');
var User = require('../models/User.js');

module.exports = function (app, io, passport) {
    debug('HoursLostController: initialized.');
    app.get('/spa', function (req, res) {
      res.render('spa');
    });
    app.get('/', function (req, res) {
        res.render('index');
    });
    app.get('/connected', function (req, res) {
       res.render('spa');
    });
    io.of('/hours-lost').on('connection', function (socket) {
      OAuth2Controller(app, socket, passport);
      RequestController(app, socket);
      socket.emit('socket:connection', 'hours-lost-server: socket successfully connected.');
      socket.on('socket:connection', function (data) {
        console.log(chalk.green(data));
      });
    });
};
