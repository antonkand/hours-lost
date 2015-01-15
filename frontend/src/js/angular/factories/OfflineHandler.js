;(function (){
  'use strict';
  angular.module('HoursLostApp')
    .factory('OfflineHandler', function (SocketHandler) {
      var offlineHandler = {};
      /* @description: statuses to check for when detecting connection */
      offlineHandler.status = {
        offline: true,
        online: false,
        reconnected: false,
        toggle: function () {
          offlineHandler.status.offline = !offlineHandler.status.offline;
          offlineHandler.status.online = !offlineHandler.status.online;
          console.log('OfflineHandler.online', offlineHandler.status.online);
          console.log('OfflineHandler.offline', offlineHandler.status.offline);
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