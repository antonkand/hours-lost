'use strict';
// npm deps
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server).of('/hours-lost');
var path = require('path');
var morgan = require('morgan');
var logger = require('express-logger');
var chalk = require('chalk');
var mongoose = require('mongoose');

// lib deps
var middleware = require('./lib/middleware/middleware.js');
var HoursLostController = require('./api/controllers/HoursLostController.js');
var dbConnection = require('./api/config/hourslost_config.js').dbConnection;

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
        console.log(chalk.cyan('hours-lost ' +
                    chalk.white('port: ' +
                    app.get('port') +
                    '. environment: ' +
                    app.get('env') + '.')
        ));
    });
};

// handles routing and control of routes
HoursLostController(app, io);

// if run directly, start server
if (require.main === module) {
    start();
}
// else it's required(), export start
else {
    // logs which worker that's handling requests
    app.use(middleware.clusterlog);
    module.exports = start;
}

