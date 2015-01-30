'use strict';
var request = require('request');
var auth = require('../../../config/auth');
var generateRequestString = function (user) {
  console.log(user.token);
  return '?access_token=' + user.token;
};
exports.get = function (user, callback) {
  var requestString = generateRequestString(user);
  console.log(requestString);
  request('https://graph.facebook.com/v2.2/me/photos' + requestString, function (error, response, body) {
    if (error || response.statusCode !== 200) {
      callback(true, body);
    }
    if (!error && response.statusCode === 200) {
      callback(null, body);
    }
  });
};
