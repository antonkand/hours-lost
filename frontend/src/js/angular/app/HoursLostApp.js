(function () {
  /* global swal */
  'use strict';
  angular
    .module('HoursLostApp', [
      'OAuth2Module',
      'CalculatedResultModule',
      'CustomizationSliderModule'
    ])
    .factory('SweetAlert', SweetAlert)
    .controller('HoursLostController', HoursLostController);
  /*
  * functions for controller and factory
  * all data in app is shared from HoursLostController
  * SweetAlertFactory gives us flashy alerts
  * */
    function HoursLostController () {
      console.log('HoursLostController: initialized');
      /*
       * calculates social media posts, such as tweets and facebook posts into minutes,
       * by using passed in estimate object
       * @param Object data: contains the data to calculate.
       * data obj should look like: { tweet: Number, facebookPost: Number, gplusPost: Number, instagram: Number }
       * @param Object minutes: minutes to calculate as estimate for each post
       * minutes obj should look like: { tweet: Number, facebookPost: Number, gplusPost: Number, instagram: Number }
       * */
      var calculateMinutes = function (data, minutes) {
        return (data.tweets ? data.tweets * minutes.tweet : 0) +
               (data.facebookPosts ? data.facebookPosts * minutes.facebookPost : 0) +
               (data.gplusPosts ? data.gplusPosts * minutes.gplusPost : 0) +
               (data.instagrams ? data.instagrams * minutes.instagram : 0);
      };
      this.data = {
        total: {
          minutes: 0
        },
        socialMediaPosts: {
          tweets: 100,
          facebookPosts: 50,
          gplusPosts: 50,
          instagrams: 70
        },
        estimates: {
          tweet: 1,
          facebookPost: 5,
          gplusPost: 5,
          instagram: 7
        }
      };
      this.data.total.minutes = calculateMinutes(this.data.socialMediaPosts, this.data.estimates);
      this.shareMessage = 'Share it yo';
    }
    function SweetAlert () {
      var alerts = {
        error: function (title, text, confirmButtonText) {
          if (angular.isString(title) && angular.isString(text) && angular.isString(confirmButtonText)) {
            return swal({ title: title,
              text: text,
              type: 'error',
              confirmButtonText: confirmButtonText });
          }
          else {
            return false;
          }
        },
        info: function (title, text, confirmButtonText) {
          if (angular.isString(title) && angular.isString(text) && angular.isString(confirmButtonText)) {
            return swal({ title: title,
              text: text,
              confirmButtonText: confirmButtonText });
          }
          else {
            return false;
          }
        }
      };
      return alerts;
    }

})();

