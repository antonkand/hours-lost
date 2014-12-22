'use strict';
var mongoose = require('mongoose');
var User = new mongoose.Schema({
  id: Number,
  twitterId: String,
  socialmediaData: {
    tweets: Number,
    facebookPosts: Number,
    instagrams: Number,
    gplusPosts: Number
  }
});
module.exports = mongoose.model('User', User);