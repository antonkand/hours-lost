;(function () {
  /*
   * @description: calculates social media posts, such as tweets and facebook posts into minutes,
   * by using passed in estimate object
   * @param Object data: contains the data to calculate.
   * data obj should look like: { tweet: Number, facebookPost: Number, gplusPost: Number, instagram: Number }
   * @param Object minutes: minutes to calculate as estimate for each post
   * minutes obj should look like: { tweet: Number, facebookPost: Number, gplusPost: Number, instagram: Number }
   * */
  'use strict';
  angular.module('HoursLostApp')
    .factory('SocialMediaCalculator', function () {
      return {
        calc: function (data, minutes) {
          return (data.tweets ? data.tweets * minutes.tweet : 0) +
                 (data.facebookPosts ? data.facebookPosts * minutes.facebookPost : 0) +
                 (data.gplusPosts ? data.gplusPosts * minutes.gplusPost : 0) +
                 (data.instagrams ? data.instagrams * minutes.instagram : 0);
        }
      };
    });
})();