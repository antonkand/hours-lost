'use strict';
var request = require('request');
var auth = require('../../../config/auth');
var generateRequestString = function (req) {
  return '?access_token='+ req.user.socialmediaData.facebook.token;
};
var requestFacebookData = function (req, res) {
  if (req.user.socialmediaData.facebook) {
    console.log('req.user.socialmediaData.facebook');
    console.log(req.user.socialmediaData.facebook);
    var requestString = generateRequestString(req);
    console.log(requestString);
    request('https://graph.facebook.com/v2.2/me/' + requestString, function (error, response, body) {
      //console.log(error);
      //console.log(response);
      console.log(body);
      if (!error && response.statusCode === 200) {
        console.log(body);
      }
    });
  }
  else {
    console.log('requestFacebookData: no user in session for Twitter');
  }
};

module.exports = function (req, res) {
  if (req.user) {
    return req.user.socialmediaData.facebook.id ?
           requestFacebookData(req, res) :
           res.json({ errorMessage: 'no twitter user in session.'});
  }
  else {
    res.json({ errorMessage: 'no twitter user in session'});
  }
};