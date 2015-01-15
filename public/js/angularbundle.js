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
    .controller('HoursLostController', ["$rootScope", "SocketHandler", "SocketEvents", "OfflineHandler", "SocialMediaCalculator", function HoursLostController ($rootScope, SocketHandler, SocketEvents, OfflineHandler, SocialMediaCalculator) {
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
    }]);
})();


/*
* @description: SocketHandler
* returns an object for easy Socket.io access
* @method emit: usage SocketHandler.emit('eventString', data)
* @method addListener: usage SocketHandler.addListener('eventString', callbackFunction)
* */
;(function () {
  'use strict';
  angular.module('HoursLostApp')
    .factory('SocketHandler', function () {
      var socketHandler = {};
      socketHandler.socket = io.connect('/hours-lost');
      /*
      * @description:
      * uses the socket to emit data
      * facade for general socket.io emit
      * @example:
      * `var emit = socketHandler.emit;
      * emit('guru', { douglas: 'crockford' });
      * @param String eventString: event to emit
      * @param Object, Array, String, etc [data]: data to emit through socket. If nothing is passed in as data, `true` is passed
      * */
      socketHandler.emit = function (eventString, data) {
        var emittedData = data ? data : true;
        socketHandler.socket.emit(eventString, emittedData);
      };
      /*
      * @description:
      * adds a listener to the socket, using socket.io's .on
      * @param String eventString: which event to listen .on
      * @param Function callback: callback to pass data to.
      * */
      socketHandler.addListener = function (eventString, callback) {
        socketHandler.socket.on(eventString, function (data) {
          callback(data);
        });
      };
      return socketHandler;
    });
})();

;(function () {
  'use strict';
  angular.module('HoursLostApp')
    .factory('SocketEvents', ["SocketHandler", function (SocketHandler) {
      /*
       * socket.io events
       * */
      var emit = SocketHandler.emit;
      var on = SocketHandler.addListener;
      var sendSession = function () {
        emit('all:session', document.cookie);
      };
      var retrieveUser = function () {
        emit('all:user');
      };
      var logConnectionToServer = function () {
        emit('socket:connection', ('hours-lost:\n client socket ' + SocketHandler.socket.ids + '\n in namespace ' + SocketHandler.socket.nsp + ' connected.'));
      };
      on('socket:connection', function (data) {
        sendSession();
        retrieveUser();
        logConnectionToServer();
      });
      on('twitter:connected', function (data) {
        console.log('twitter:connected ' + data);
      });
      on('facebook:connected', function (data) {
        console.log('facebook:connected ' + data);
      });
      on('instagram:connected', function (data) {
        console.log('instagram:connected ' + data);
      });
      on('google:connected', function (data) {
        console.log('google:connected ' + data);
      });
      on('twitter:user', function (data) {
        console.log('twitter:user received: ' + data);
      });
      on('twitter:req', function (data) {
        console.log('twitter:req.');
        console.log(data);
      });
      // we won't be exposing the events to controllers,
      // only injection is needed
      // so: only log that they've been injected
      return {log: console.log('SocketEvents: injected')};
    }]);
})();
;(function (){
  'use strict';
  angular.module('HoursLostApp')
    .factory('OfflineHandler', ["SocketHandler", "$rootScope", function (SocketHandler, $rootScope) {
      var offlineHandler = {};
      var on = SocketHandler.addListener;
      var emit = SocketHandler.emit;
      /* @description: statuses to check for when detecting connection */
      offlineHandler.status = {
        offline: true,
        online: false,
        reconnected: false,
        firstConnect: true,
        toggle: function () {
          offlineHandler.status.offline = !offlineHandler.status.offline;
          offlineHandler.status.online = !offlineHandler.status.online;
          console.log('OfflineHandler.online', offlineHandler.status.online);
          console.log('OfflineHandler.offline', offlineHandler.status.offline);
          if (offlineHandler.status.online) {
            $rootScope.$emit('status:online');
          }
        }
      };
      /*
      * @description: handles stringification and setting of object into localStorage
      * @return: offlineHandler returns this object to make offlineHandler.set(id, obj).get(id) possible (only chainable function in offlineHandler)
      * */
      offlineHandler.set = function (id, obj) {
        if (!id || !obj) {
          console.log('offlineHandler.set: no obj passed in or id missing');
        }
        else {
          try {
            localStorage.setItem(id, JSON.stringify(obj));
          }
          catch (e) {
            console.log('offlineHandler.set: couldn\'t set obj', e);
          }
        }
        return offlineHandler; // makes .set().get() available, if you're into that.
      };
      /*
      * @description: gets from localStorage and handles parsing of JSON
      * @return: returns a parsed obj
      * */
      offlineHandler.get = function (id) {
        var data = null;
        if (!id) {
          console.log('offlineHandler.get: id missing');
        }
        else {
          try {
            data = localStorage.getItem(id);
          }
          catch (e) {
            console.log('offlineHandler.get: no stored object found');
          }
        }
        return JSON.parse(data);
      };
      /*
      * @description: Socket.io events for checking connection status
      * changes state from online and offline and detects reconnection to Socket.io
      * */
      on('disconnect', function () {
        offlineHandler.status.toggle();
      });
      on('connect', function () {
        offlineHandler.status.firstConnect = false;
        offlineHandler.status.toggle();
      });
      on('reconnect', function () {
        offlineHandler.status.reconnected = true;
        console.log('offlineHandler.reconnected', offlineHandler.status.reconnected);
      });
      return offlineHandler;
    }]);
})();
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
;(function () {
  'use strict';
  angular
    .module('OAuth2Module', [])
    .directive('oauthButtons', function () {
      return {
        restrict: 'E',
        replace: false,
        templateUrl: 'js/angulartemplates/components/OAuth2Component/oauth2_template.html',
        link: function (scope, elem, attrs) {
          console.log('oauthButtons: initialized');
        }
      };
    })
    .controller('OAuth2Controller', OAuth2Controller);
    function OAuth2Controller () {
      console.log('OAuth2Controller: initialized');
    }
})();
;(function () {
  'use strict';
  angular
    .module('SharingModule', [])
    .directive('shareField', function () {
      return {
        scope: {
          sharemessage: '@'
        },
        restrict: 'E',
        replace: false,
        templateUrl: 'js/angulartemplates/components/SharingComponent/sharing_template.html',
        link: function (scope, elem, attrs) {
          console.log('shareField: initialized');
        }
      };
    })
    .controller('ShareFieldController', ShareFieldController);
  function ShareFieldController () {
    console.log('ShareFieldController: initialized');
  }
})();
(function () {
  'use strict';
  angular
    .module('CalculatedResultModule', [])
    .directive('calculatedResult', function () {
      return {
        scope: {
          totals: '='
        },
        restrict: 'E',
        replace: false,
        templateUrl: 'js/angulartemplates/components/CalculatedResultComponent/calculatedresult_template.html',
        link: function (scope, elem, attrs) {
          console.log('calculatedResult: initialized');
        }
      };
    })
    .controller('CalculatedResultController', CalculatedResultController(SweetAlert))
    .factory('SweetAlert', SweetAlert);
  function CalculatedResultController () {}
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
(function () {
  'use strict';
  angular
    .module('CustomizationSliderModule', [])
    .directive('customizationSliders', function () {
      return {
        scope: {
          estimates: '='
        },
        restrict: 'E',
        replace: false,
        templateUrl: 'js/angulartemplates/components/CustomizationSliderComponent/customizationslider_template.html',
        link: function (scope, elem, attrs) {
        }
      };
    })
    .controller('CustomizationSliderController', CustomizationSliderController);
  function CustomizationSliderController ($scope) {
    console.log('CustomizationSliderController: initialized');
  }
  CustomizationSliderController.$inject = ["$scope"];
})();