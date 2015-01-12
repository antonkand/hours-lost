'use strict';

// lib deps
var config = require('./config/hourslost_config.js');
var middleware = require('./lib/middleware/middleware.js');
var HoursLostController = require('./api/controllers/HoursLostController.js');
var httpsOptions = config.https;
var dbConnection = config.dbConnection;

// npm deps
var express = require('express');
var app = express();
var server = require('https').Server(httpsOptions, app);
var io = require('socket.io')(server);
var path = require('path');
var morgan = require('morgan');
var logger = require('express-logger');
var chalk = require('chalk');
var mongoose = require('mongoose');

// morgan used for logging when developing
// logging once per 24 h in prod
switch (app.get('env')) {
  case 'development':
    app.use(morgan('dev'));
    break;
  case 'production':
    app.use(logger({
      path: __dirname + '/log/requests.log'
    }));
    break;
}

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.set('port', process.env.PORT || 8080);

// db
mongoose.connect(dbConnection);

// kickstarts the machinery
var start = function () {
  server.listen(app.get('port'), function () {
    console.log(chalk.cyan('hours-lost ' + chalk.white('port: ' + app.get('port') + '. environment: ' + app.get('env') + '.')
    ));
  });
};

// main controller
HoursLostController(app, io);
start();


