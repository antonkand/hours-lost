;(function () {
  /* global swal */
  'use strict';
  angular
    .module('HoursLostApp', [
      'OAuth2Module',
      'CalculatedResultModule',
      'CustomizationSliderModule',
      'SharingModule'
    ])
    .controller('HoursLostController', function HoursLostController (SocketHandler, SocketEvents, OfflineHandler) {
      var that = this;
      var on = SocketHandler.addListener;
      var emit = SocketHandler.emit;
      console.log('HoursLostController: initialized');
      console.log(this.status);
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
      this.user = {
        id: null,
        accounts: [
          {
            media: 'instagram',
            name: null,
            id: 123
          },
          {
            media: 'facebook',
            name: null,
            id: 123
          },
          {
            media: 'twitter',
            name: null,
            id: 123
          },
          {
            media: 'gplus',
            name: 'johan',
            id: 123
          }
        ]
      };
      /*
      * gets all social media data authed by the user
      * */
      this.getSocialMediaData = function () {
       that.user.accounts
          .filter(function (site) {
            console.log(site.name);
             return that.user.accounts[site.name] !== null;
          })
          .forEach(function (socialmedia) {
            console.log('socialmedia');
            console.log(socialmedia.media);
            emit('get:' + socialmedia.media, socialmedia);
          });
      };
      /*
      * returns true if any social media has authed
      * */
      this.userHasAuthed = function () {
        if (this.user.instagram === true ||
            this.user.facebook === true ||
            this.user.gplus === true ||
            this.user.twitter === true ) {
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

