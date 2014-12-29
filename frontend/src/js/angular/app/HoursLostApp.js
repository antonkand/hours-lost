(function () {
  'use strict';
  angular
    .module('HoursLostApp', [
      'OAuth2Module',
      'CalculatedResultModule',
      'CustomizationSliderModule'
    ])
    .controller('HoursLostController', HoursLostController);
    function HoursLostController () {
      console.log('HoursLostController: initialized');
      this.minutes = {
        total: 0,
        estimates: {
          tweet: 1,
          facebookPost: 5,
          gplusPost: 5,
          instagram: 7
        }
      };
      this.shareMessage = "Share it yo";
    }
})();

