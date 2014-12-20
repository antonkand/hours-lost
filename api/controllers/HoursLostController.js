'use strict';
var chalk = require('chalk');
var debug = require('debug');
var OAuth2Controller = require('./OAuth2Controller.js');
module.exports = function (app, io) {
    debug('HoursLostController: initialized.');
    app.get('/', function (req, res) {
        res.render('index');
    });
    app.get('/connected', function (req, res) {
       res.render('connected');
    });

    io.on('connection', function (socket) {
      socket.emit('socket:connection', 'hours-lost-server: socket successfully connected.');
      socket.on('socket:connection', function (data) {
        console.log(chalk.green(data));
    });
});
    OAuth2Controller(app, io);
};
