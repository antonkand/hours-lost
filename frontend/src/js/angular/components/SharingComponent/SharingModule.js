;(function () {
  'use strict';
  angular
    .module('SharingModule', [])
    .directive('shareField', function () {
      return {
        scope: {
          sharemessage: '@'
        },
        restrict: 'E',
        replace: false,
        templateUrl: 'js/angulartemplates/components/SharingComponent/sharing_template.html',
        link: function (scope, elem, attrs) {
          console.log('shareField: initialized');
        }
      };
    })
    .controller('SharingController', function ($rootScope) {
      var controller = this;
      controller.isVisible = false;
      $rootScope.$on('user:connected', function () {
        console.log('rootScope user:connected. SharingController showing.');
        controller.isVisible = true;
      });
    });
})();