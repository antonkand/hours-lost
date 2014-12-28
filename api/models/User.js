'use strict';
var mongoose = require('mongoose');
var User = new mongoose.Schema({
  id: Number,
  socialmediaData: {
    twitter: {
      id: String,
      token: String,
      username: String,
      displayName: String
    },
    facebook: {
      id: String,
      token: String,
      name: String,
      email: String
    },
    google: {
      id: String,
      token: String,
      name: String,
      email: String
    },
    tweets: Number,
    facebookPosts: Number,
    instagrams: Number,
    gplusPosts: Number
  }
});
module.exports = mongoose.model('User', User);