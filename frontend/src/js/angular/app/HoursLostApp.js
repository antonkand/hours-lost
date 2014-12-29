(function () {
  'use strict';
  angular
    .module('HoursLostApp', ['OAuth2Module'])
    .controller('HoursLostController', HoursLostController);
    function HoursLostController () {
      console.log('HoursLostController: initialized');
      this.minutes = 100;
      this.shareMessage = "Share it yo";
    }
})();

