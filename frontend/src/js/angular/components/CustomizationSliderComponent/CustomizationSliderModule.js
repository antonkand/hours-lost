(function () {
  'use strict';
  angular
    .module('CustomizationSliderModule', [])
    .directive('customizationSliders', function () {
      return {
        scope: {
          data: '=ngModel'
        },
        restrict: 'E',
        replace: false,
        templateUrl: 'js/angulartemplates/components/CustomizationSliderComponent/customizationslider_template.html',
        link: function (scope, elem, attrs) {
          console.log('scope.data');
          console.log(scope.data);
          console.log(elem);
          console.log(attrs);
        }
      };
    })
    .controller('CustomizationSliderController', CustomizationSliderController);
  function CustomizationSliderController ($scope) {
    console.log('CustomizationSliderController: initialized');
  }
})();