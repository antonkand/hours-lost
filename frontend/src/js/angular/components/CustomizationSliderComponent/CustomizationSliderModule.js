(function () {
  'use strict';
  angular
    .module('CustomizationSliderModule', [])
    .directive('customizationSliders', function () {
      return {
        scope: {
          tweetEstimate: '=',
          facebookEstimate: '=',
          gplusEstimate: '=',
          instagramEstimate: '=',
          totalEstimate: '='
        },
        restrict: 'E',
        replace: false,
        templateUrl: 'js/angulartemplates/components/CustomizationSliderComponent/customizationslider_template.html',
        link: function (scope, elem, attrs) {
          console.log('customizationSliders: initialized');
        }
      };
    })
    .controller('CustomizationSliderController', CustomizationSliderController);
  function CustomizationSliderController () {
    console.log('CustomizationSliderController: initialized');
  }
})();