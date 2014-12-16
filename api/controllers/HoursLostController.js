'use strict';
var chalk = require('chalk');
var responseCallback = function (res, json) {
    res.json(json);
};
module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index');
    });
    app.get('/connected', function (req, res) {
       res.render('connected');
    });
};
