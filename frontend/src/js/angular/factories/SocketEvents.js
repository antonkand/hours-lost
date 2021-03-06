;(function () {
  'use strict';
  angular.module('HoursLostApp')
    .factory('SocketEvents', function (SocketHandler) {
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
      on('twitter:data', function (data) {
        console.log('twitter:data received: ' + data);
      });
      // we won't be exposing the events to controllers,
      // only injection is needed
      // so: only log that they've been injected
      return {log: console.log('SocketEvents: injected')};
    });
})();