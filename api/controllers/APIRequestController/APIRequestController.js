'use strict';
// npm deps
var debug = require('debug');
var chalk = require('chalk');
// lib deps
var User = require('../../models/User.js');
var getTwitterData = require('./TwitterRequestService.js').get;
var getFacebookData = require('./FacebookRequestService.js').get;
var getInstagramData = require('./InstagramRequestService.js').get;

/*
 * @description does requests to external APIs on successful auths
 * @param Express-app app: catches the `get:userdata` event, requests according to type of social media
 * @param Socket.io socket socket: emits data to client
 * */
module.exports = function (app) {
  app.on('get:userdata', function (data) {
    if (data.site === 'twitter') {
      console.log(chalk.green('get:userdata ') + chalk.white('user authed against twitter:\n' + data.user.socialmediaData.twitter));
      // pass in the user's credentials into the GET
      getTwitterData(data.user.socialmediaData.twitter, function (fail, body) {
        // response failed, log the body with error msg
        if (fail) {
          console.error('getTwitterData: ', body);
          return;
        }
        // response success,
        // save tweets to db,
        // emit tweets to main controller
        else {
          User.find({'socialmediaData.twitter.id': data.user.socialmediaData.twitter.id}, function (err, user) {
            // crashed db connection
            if (err) {
              throw err;
            }
            // emit the response body to main controller
            else {
              app.emit('get:twitter', body);
              console.log(chalk.green('found user after Facebook GET: ') + user);
            }
          });
        }
      });
    }
    if (data.site === 'instagram') {
      console.log(chalk.green('get:userdata ') + chalk.white('user authed against instagram:\n' + data.user.socialmediaData.instagram));
      // pass in the user's credentials into the GET
      getInstagramData(data.user.socialmediaData.instagram, function (fail, body) {
        // response failed, log the body with error msg
        if (fail) {
          console.error('getInstagramData: ', body);
          return;
        }
        // response success,
        // save instagrams to db,
        // emit instagrams to main controller
        else {
          User.findOne({'socialmediaData.instagram.id': data.user.socialmediaData.instagram.id}, function (err, user) {
            // crashed db connection
            if (err) {
              throw err;
            }
            // emit the response body to main controller
            else {
              var json = { instagrams: JSON.parse(body).data.counts.media };
              console.log(json);
              user.instagrams = json;
              user.save();
              app.emit('get:instagram', json);
            }
          });
        }
      });
    }
    if (data.site === 'facebook') {
      console.log(chalk.green('get:userdata ') + chalk.white('user authed against facebook:\n' + data.user.socialmediaData.facebook));
      // pass in the user's credentials into the GET
      getFacebookData(data.user.socialmediaData.facebook, function (fail, body) {
        // response failed, log the body with error msg
        if (fail) {
          console.error('getFacebookData: ', body);
          return;
        }
        // response success,
        // save fb posts to db,
        // emit fb posts to main controller
        else {
          User.findOne({'socialmediaData.facebook.id': data.user.socialmediaData.facebook.id}, function (err, user) {
            // crashed db connection
            if (err) {
              throw err;
            }
            // emit the response body to main controller
            else {
              var json = { posts: JSON.parse(body).data };
              console.log(JSON.parse(body));
              user.facebookPosts = json;
              user.save();
              app.emit('get:facebook', json);
            }
          });
        }
      });
    }
    if (data.site === 'google') {
      console.log(chalk.green('get:userdata ') + chalk.white('user authed against google:\n' + data.user.socialmediaData.google));
    }
  });
};