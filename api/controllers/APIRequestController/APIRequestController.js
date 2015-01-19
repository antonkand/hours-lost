'use strict';
// npm deps
var debug = require('debug');
var chalk = require('chalk');

// lib deps
var TwitterRequestService = require('./TwitterRequestService.js');
var FacebookRequestService = require('./FacebookRequestService.js');

/*
* @description does requests to external APIs on successful auths
* @param Express-app app: catches the `get:userdata` event, requests according to type of social media
* @param Socket.io socket socket: emits data to client
* */
module.exports = function (app, socket) {
  app.on('get:userdata', function (data) {
    if (data.site === 'twitter') {
      console.log(
        chalk.green('get:userdata ') + chalk.white('user authed against twitter:\n' + data.user.socialmediaData.twitter));
    }
    if (data.site === 'instagram') {
      console.log(
        chalk.green('get:userdata ') + chalk.white('user authed against instagram:\n' + data.user.socialmediaData.instagram));
    }
    if (data.site === 'facebook') {
      console.log(
        chalk.green('get:userdata ') + chalk.white('user authed against facebook:\n' + data.user.socialmediaData.facebook));
    }
  });
  //app.get('/socialdata/twitter', function (req, res) {
  //  TwitterRequestService(req, res);
  //});
  //app.get('/socialdata/facebook', function (req, res) {
  //  FacebookRequestService(req, res);
  //});
};