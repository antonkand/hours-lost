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
      /*
      * socket.io events
      * */
      var emit = socketHandler.emit;
      var on = socketHandler.addListener;
      var sendSession = function () {
        emit('all:session', document.cookie);
      };
      var retrieveUser = function () {
        emit('all:user');
      };
      var logConnectionToServer = function () {
        emit('socket:connection', ('hours-lost:\n client socket ' + socketHandler.socket.ids + '\n in namespace ' + socketHandler.socket.nsp + ' connected.'));
      };
      on('socket:connection', function (data) {
        console.log(data);
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
      on('all:user', function (data) {
        console.log('all:user');
        if (data) {
          console.log(data);
        }
      });
       return socketHandler;
    });
})();
