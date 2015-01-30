'use strict';
var request = require('request');
var auth = require('../../../config/auth');
var generateRequestString = function (user) {
  return '?screen_name=' +
         user.username +
         '&oauth_token=' + user.token +
         '&oauth_consumer_key=' + auth.twitter.consumer_key +
         '&oauth_signature_method=HMAC-SHA1';
};
exports.get = function (user, callback) {
  var requestString = generateRequestString(user);
  console.log(requestString);
  request('https://api.twitter.com/1.1/users/show.json' + requestString, function (error, response, body) {
    if (error || response.statusCode !== 200) {
      callback(true, body);
    }
    if (!error && response.statusCode === 200) {
      callback(null, body);
    }
  });
};
