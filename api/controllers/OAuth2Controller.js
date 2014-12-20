var SocialMediaData = require('../models/User.js');
var debug = require('debug');

var logOnSave = function (socialMediaData) {
  'use strict';
  console.log('OAuth2Controller.js: saved ' + socialMediaData);
};
module.exports = function (app, io) {
  'use strict';
  debug('OAuth2Controller: initialized.');
  var save = function (callback) {
    var socialMediaData = new User({
      id: 1,
      tweets: 200,
      facebookPosts: 200,
      instagrams: 200,
      gplusPosts: 200
    });
    socialMediaData.save();
    // .then callback(socialMediaData);
  };
};