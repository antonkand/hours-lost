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
