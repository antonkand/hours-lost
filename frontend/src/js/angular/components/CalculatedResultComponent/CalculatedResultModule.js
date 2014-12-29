(function () {
  'use strict';
  angular
    .module('CalculatedResultModule', [])
    .directive('calculatedResult', function () {
      return {
        scope: {
          minutes: '='
        },
        restrict: 'E',
        replace: false,
        templateUrl: 'js/angulartemplates/components/CalculatedResultComponent/calculatedresult_template.html',
        link: function (scope, elem, attrs) {
          console.log('calculatedResult: initialized');
        }
      };
    })
    .controller('CalculatedResultController', CalculatedResultController);
  function CalculatedResultController () {
    console.log('CalculatedResult: initialized');
  }
})();