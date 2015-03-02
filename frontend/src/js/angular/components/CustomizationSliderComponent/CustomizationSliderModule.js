(function () {
  'use strict';
  angular
    .module('CustomizationSliderModule', [])
    .directive('customizationSliders', function () {
      return {
        scope: {
          estimates: '=',
          recalc: '='
        },
        restrict: 'E',
        replace: false,
        templateUrl: 'js/angulartemplates/components/CustomizationSliderComponent/customizationslider_template.html',
        link: function (scope, elem, attrs) {
        }
      };
    })
    .controller('CustomizationSliderController', function ($rootScope) {
      var controller = this;
      controller.isVisible = false;
      $rootScope.$on('user:connected', function () {
        console.log('rootScope user:connected. CustomizationSliderController showing.');
        controller.isVisible = true;
      });
    });
})();