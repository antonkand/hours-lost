;
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
    .controller('HoursLostController', function HoursLostController ($rootScope, SocketHandler, SocketEvents, OfflineHandler, SocialMediaCalculator) {
      this.data = {};
      this.user = {};
      this.shareMessage = null;
      var that = this;
      var localId = 'hoursLost'; // used as localStorage id
      var calc = SocialMediaCalculator.calc;
      var on = SocketHandler.addListener;
      var emit = SocketHandler.emit;
      var offlineHandler = OfflineHandler;
      var getDataFromServer = function () {
        return {
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
      };
      /*
      * @description:
      * calculates total number of minutes spent depending on number of posts etc
      */
      var setTotalMinutes = function (data, minutes) {
        this.data.total.minutes = (data > 0 && minutes > 0) ? calc(data, minutes) : 0;
      }.bind(this);
      /*
       * @description: this.data is used for storage of number of social media posts, total number of minutes spent and the default estimated time per social media post
       * each estimate can be overridden by the user
       * */
      var detectDataSet = function (callback) {
        console.log('detectDataSet: online status ', offlineHandler.status.online);
        if (offlineHandler.status.online) {
          this.data = getDataFromServer();
          offlineHandler.set(localId, this.data);
          this.shareMessage = 'I\'ve lost about ' + (Math.ceil(this.data.total.minutes / 60 / 24) > 1 ? Math.ceil(this.data.total.minutes / 60 / 24) + ' days ' : 'one day ') + 'of my life to social media. Check out https://hourslo.st to know how much you\'ve lost.';
          callback(this.data.socialMediaPosts, this.data.estimates);
        }
        if (offlineHandler.status.reconnected) {
          return;
        }
        if (offlineHandler.status.offline) {
          this.data = offlineHandler.status.firstConnect ? getDataFromServer() : offlineHandler.get(localId);
          callback(this.data.socialMediaPosts, this.data.estimates);
        }
      }.bind(this);
      // when connection state changes, detect which data set to use
      $rootScope.$on('status:online', function () {
        console.log('$rootScope: status:online changed');
        detectDataSet(setTotalMinutes);
      });
      console.log('HoursLostController: initialized');
      // on connect, server emits all:user,
      // fetch those user accounts, overwrite this.user.accounts
      on('all:user', function (data) {
        console.log('all:user');
        if (data) {
          that.user.accounts = data.user;
          console.log('user updated with server data: ', that.user);
        }
      });
      /*
       * gets all social media data authed by the user
       * */
      this.getSocialMediaData = function () {
        that.user.accounts.filter(function (site) {
            return site.name !== null;
          })
          .forEach(function (socialmedia) {
            emit('get:' + socialmedia.media, socialmedia);
          });
      };
    });
})();

