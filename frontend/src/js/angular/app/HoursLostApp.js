(function () {
  /* global swal */
  'use strict';
  angular
    .module('HoursLostApp', [
      'OAuth2Module',
      'CalculatedResultModule',
      'CustomizationSliderModule'
    ])
    .controller('HoursLostController', HoursLostController)
    .factory('SweetAlert', SweetAlert);
    /*
    * functions for controller and factory
    * all data in app is shared from HoursLostController
    * SweetAlertFactory gives us flashy alerts
    * */
    function HoursLostController () {
      console.log('HoursLostController: initialized');
      this.calculatedData = {
        total: {
          minutes: 110
        },
        estimates: {
          tweet: 1,
          facebookPost: 5,
          gplusPost: 5,
          instagram: 7
        }
      };
      this.shareMessage = "Share it yo";
    }
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

