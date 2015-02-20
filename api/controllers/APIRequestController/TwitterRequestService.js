'use strict';
var auth = require('../../../config/auth');
var client = new require('twitter')({
  consumer_key: auth.twitter.consumer_key,
  consumer_secret: auth.twitter.consumer_secret,
  access_token_key: auth.twitter.access_token,
  access_token_secret: auth.twitter.access_secret
});

exports.get = function (user, callback) {
  console.log('twitter user, exports get', user);
  var screenName = user.username;
  client.get('statuses/user_timeline', screenName, function(error, tweets, response){
      if (!error) {
        callback(false, tweets);
      }
      else {
        callback(true, null);
      }
  });
};

