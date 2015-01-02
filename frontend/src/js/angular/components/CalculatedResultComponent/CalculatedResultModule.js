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
  function CalculatedResultController () {
    //var clarification = document.querySelector('#clarification');
    //var infoAlert = SweetAlertFactory.info;
    //clarification.addEventListener('keydown', function (e) {
    //  e = e || event;
    //  e.preventDefault();
    //  infoAlert('This is my explanation header', 'this is my text', 'you click ok');
    //}, false);
    //clarification.addEventListener('click', function (e) {
    //  e = e || event;
    //  e.preventDefault();
    //  infoAlert('This is my explanation header', 'this is my text', 'you click ok');
    //}, false);
    //console.log('CalculatedResult: initialized');
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