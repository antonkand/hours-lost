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
    .controller('HoursLostController', function HoursLostController ($rootScope, SocketHandler, SocketEvents, OfflineHandler, SocialMediaCalculator, $http) {
      $rootScope.$hasConnectedToSocialMedia = false;
      this.data = {};
      this.user = {};
      this.shareMessage = null;
      this.usernames = {
        instagram: null,
        facebook: null,
        twitter: null,
        google: null
      };
      var controller = this;
      var localId = 'hoursLost'; // used as localStorage id
      var calc = SocialMediaCalculator.calc;
      var socketOn = SocketHandler.addListener;
      var socketEmit = SocketHandler.emit;
      var offlineHandler = OfflineHandler;
      var getDataFromServer = function () {
        // TODO: $http.get this data
        console.log(controller.data);
        return {
          total: {
            minutes: 333
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
      };
      /*
       * @description:
       * calculates total number of minutes spent depending on number of posts etc
       */
      var setTotalMinutes = function (data, minutes) {
        console.log('setTotalMinutes, data', data);
        console.log('setTotalMinutes, minutes', minutes);
        controller.data.total.minutes = (data && minutes) ? calc(data, minutes) : 0;
      };
      controller.recalc = function () {
        console.log('recalculating');
        setTotalMinutes(controller.data.socialMediaPosts, controller.data.estimates)
      };
      /*
       * @description: this.data is used for storage of number of social media posts, total number of minutes spent and the default estimated time per social media post
       * each estimate can be overridden by the user
       * */
      var detectDataSet = function (callback) {
        if (offlineHandler.status.online) {
          controller.data = getDataFromServer();
          offlineHandler.set(localId, controller.data);
          controller.shareMessage = 'I\'ve lost about ' + (Math.ceil(controller.data.total.minutes / 60 / 24) > 1 ? Math.ceil(controller.data.total.minutes / 60 / 24) + ' days ' : 'one day ') + 'of my life to social media. Check out https://hourslo.st to know how much you\'ve lost.';
          callback(controller.data.socialMediaPosts, controller.data.estimates);
        }
        if (offlineHandler.status.reconnected) {
          return;
        }
        if (offlineHandler.status.offline) {
          controller.data = offlineHandler.status.firstConnect ? getDataFromServer() : offlineHandler.get(localId);
          callback(controller.data.socialMediaPosts, controller.data.estimates);
        }
      };
      // when connection state changes, detect which data set to use
      $rootScope.$on('status:online', function () {
        detectDataSet(setTotalMinutes);
      });
      console.log('HoursLostController: initialized');
      // on connect, server emits all:user,
      // fetch those user accounts, overwrite this.user.accounts
      // store usernames in this.usernames for reference on oauth buttons
      socketOn('all:user', function (data) {
        if (data) {
          $rootScope.$emit('user:connected', true);
          controller.user.accounts = data.user;
          $rootScope.$apply(function () {
            controller.user.accounts.forEach(function (active) {
              controller.usernames[active.media] = active.name;
            });
          });
          // TODO: pick an id from user.accounts, run detectDataSet(setTotalMinutes)
          console.log('user updated with server data: ', controller.user.accounts);
        }
      });
      socketOn('get:twitter', function (data) {
        console.log('get:twitter');
        controller.data.socialMediaPosts.tweets = data;
        console.log(controller.data);
      });
      socketOn('get:instagram', function (data) {
        console.log('get:instagram');
        controller.data.socialMediaPosts.instagrams = data;
        console.log(controller.data);
      });
      /*
       * gets all social media data authed by the user
       * */
      controller.getSocialMediaData = function () {
        controller.user.accounts.filter(function (site) {
          return site.name !== null;
        })
          .forEach(function (socialmedia) {
            socketEmit('get:' + socialmedia.media, socialmedia);
          });
      };
    });
})();

