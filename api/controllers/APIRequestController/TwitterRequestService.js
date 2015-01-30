'use strict';
var request = require('request');
var auth = require('../../../config/auth');
var crypto = require('crypto');

var hashSignature = function (signature, signingKey, callback) {
  var algorithm = 'sha1';
  var key = signingKey;
  var text = signature;
  var hmac = crypto.createHmac(algorithm, key);
  hmac.setEncoding('base64');
  hmac.end(text, function () {
    var hash = hmac.read();
    callback(hash);
  });
};
var createSigningKey = function (consumerSecret, oauthTokenSecret) {
  return encodeURI(consumerSecret) + '&' + encodeURI(oauthTokenSecret);
};
var createSignatureString = function (method, url, reqParams) {
  var signature = method.toUpperCase() + '&';
  signature += encodeURI(url) + '&';
  signature += encodeURI(reqParams);
  return signature;
};
var getHash = function (user) {
  var signature = createSignatureString('get', 'https://api.twitter.com/1.1/lists/list.json', ('?user_id=' + user.id));
  var key = createSigningKey(auth.twitter.consumer_secret, auth.twitter.access_token);
  return hashSignature(signature, key, function (hashedSignature) {
    return hashedSignature;
  });
};
var generateRequestOptions = function (user, hash) {
  console.log(user);
  console.log('generateRequestOptions hash: ' + hash);

  return {
    url: 'https://api.twitter.com/1.1/lists/list.json'
    //headers: {
    //  Authorization: 'OAuth oauth_consumer_key=' + auth.twitter.consumer_key + ', oauth_nonce="d23e02809fabbfccf8e36311a0eca819", oauth_signature="%2BqFSRnCn96ItiLNO6KMC5E1N44c%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1422620634", oauth_token=' + auth.twitter.access_token + ', oauth_version="1.0"'
    //
    //
    //
    //
    //  '?user_id=' +user.id +
    //  '&oauth_access_token='
    //  '&oauth_access_secret='                             +auth.twitter.access_secret +
    //  '&oauth_consumer_key=' + +
    //    '&oauth_consumer_secret=' + auth.twitter.consumer_secret
    //}
  };
};
exports.get = function (user, callback) {
  // TODO: make sure hash is set before passing in
  var hash = getHash(user);
  console.log('exports.get hash: ' + hash);
  var requestString = generateRequestOptions(user, hash);
  console.log(requestString);
  request(requestString, function (error, response, body) {
    if (error || response.statusCode !== 200) {
      callback(true, body);
    }
    if (!error && response.statusCode === 200) {
      callback(null, body);
    }
  });
};
