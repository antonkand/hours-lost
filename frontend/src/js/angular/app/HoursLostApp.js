(function () {
  /* global swal */
  'use strict';
  angular
    .module('HoursLostApp', [
      'OAuth2Module',
      'CalculatedResultModule',
      'CustomizationSliderModule',
      'SharingModule'
    ])
    //.controller('HoursLostController', HoursLostController($http));
    .controller('HoursLostController', function HoursLostController ($http) {
      var that = this;
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

      /*
      * this.data is used for storage of number of social media posts, total number of minutes spent and the default estimated time per social media post
      * each estimate can be overridden by the user
      * */
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
      this.activeAccounts = {
        instagram: true,
        twitter: false,
        facebook: false,
        gplus: false
      };
      /*
      * gets all social media data authed by the user
      * */
      this.getSocialMediaData = function ($http) {
        Object.keys(that.activeAccounts)
          .filter(function (authedMedia) {
            return that.activeAccounts[authedMedia] === true;
          })
          .forEach(function (mediaToGET) {
            console.log(mediaToGET);
            $http.get('/socialdata/' + mediaToGET)
              .success(function(data, status, headers, config) {
                console.log(data);
                console.log(status);
              })
              .error(function(data, status, headers, config) {
                console.log(data);
                console.log(status);
              });
          });
      };
      /*
      * returns true if any social media has authed
      * */
      this.userHasAuthed = function () {
        if (this.activeAccounts.instagram === true ||
            this.activeAccounts.facebook === true ||
            this.activeAccounts.gplus === true ||
            this.activeAccounts.twitter === true ) {
          return true;
        }
        else {
          return false;
        }
      }.bind(this);
      /*
      * all directives use this var as passed in data
      * */
      this.data.total.minutes = calculateMinutes(this.data.socialMediaPosts, this.data.estimates);
      /*
      * the message to share with your friends, either singular or plural depending on time spent
      * */
      this.shareMessage = 'I\'ve lost about ' + (Math.ceil(this.data.total.minutes / 60 / 24) > 1 ? Math.ceil(this.data.total.minutes / 60 / 24) + ' days ' : 'one day ') + 'of my life to social media. Check out https://hourslo.st to know how much you\'ve lost.';
    });
})();

