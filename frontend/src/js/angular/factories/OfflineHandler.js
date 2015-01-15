;(function (){
  'use strict';
  angular.module('HoursLostApp')
    .factory('OfflineHandler', function (SocketHandler) {
      var offlineHandler = {};
      offlineHandler.status = {
        disconnected: true,
        connected: false,
        reconnected: false,
        toggle: function () {
          offlineHandler.status.disconnected = !offlineHandler.status.disconnected;
          offlineHandler.status.connected = !offlineHandler.status.connected;
          console.log('OfflineHandler.toggle: connected', offlineHandler.status.connected);
          console.log('OfflineHandler.toggle: disconnected', offlineHandler.status.disconnected);
        }
      };
      var on = SocketHandler.addListener;
      on('disconnect', function () {
        offlineHandler.status.toggle();
      });
      on('connect', function () {
        offlineHandler.status.toggle();
      });
      on('reconnect', function () {
        offlineHandler.status.reconnected = true;
        console.log('offlineHandler.reconnected', offlineHandler.status.reconnected);
      });
      return offlineHandler;
    });
})();