'use strict';
var request = require('request');
var auth = require('../../../config/auth');
var generateRequestString = function (req) {
  return '?screen_name=' +
         req.user.socialmediaData.twitter.username +
         '&oauth_token=' + req.user.socialmediaData.twitter.token +
         '&oauth_consumer_key=' + auth.twitter.consumer_key +
         '&oauth_signature_method=HMAC-SHA1';
};
var requestTwitterData = function (req, res) {
  if (req.user.socialmediaData.twitter) {
    console.log('req.user.socialmediaData.twitter');
    console.log(req.user.socialmediaData.twitter);
    var requestString = generateRequestString(req);
    console.log(requestString);
    request('https://api.twitter.com/1.1/users/show.json' + requestString, function (error, response, body) {
      //console.log(error);
      //console.log(response);
      console.log(body);
      if (!error && response.statusCode === 200) {
        console.log(body);
      }
    });
  }
  else {
    console.log('requestTwitterData: no user in session for Twitter');
  }
};

module.exports = function (req, res) {
  if (req.user) {
    return req.user.socialmediaData.twitter ?
           requestTwitterData(req, res) :
           res.json({ errorMessage: 'no twitter user in session.'});
  }
  else {
    res.json({ errorMessage: 'no twitter user in session'});
  }
};