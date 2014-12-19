'use strict';
var mongoose = require('mongoose');
var SocialMediaData = mongoose.Schema({
  id: Number,
  tweets: Number,
  facebookPosts: Number,
  instagrams: Number,
  gplusPosts: Number
});
module.exports = mongoose.model('SocialMediaData', SocialMediaData);