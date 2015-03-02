(function () {
  'use strict';
  angular
    .module('CalculatedResultModule', [])
    .directive('calculatedResult', function () {
      return {
        scope: {
          total: '='
        },
        restrict: 'E',
        replace: false,
        templateUrl: 'js/angulartemplates/components/CalculatedResultComponent/calculatedresult_template.html',
        link: function (scope, elem, attrs) {
          console.log('calculatedResult: initialized');
        }
      };
    })
    .controller('CalculatedResultController', function ($rootScope) {
      var controller = this;
      controller.isVisible = false;
      $rootScope.$on('user:connected', function () {
        console.log('rootScope user:connected. CalculatedResultController showing.');
        controller.isVisible = true;
      });
    });
})();