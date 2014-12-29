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


(function () {
  'use strict';
  angular
    .module('OAuth2Module', [])
    .directive('oauthButtons', function () {
      return {
        restrict: 'E',
        replace: false,
        templateUrl: 'js/angulartemplates/components/OAuth2Component/oauth2_template.html',
        link: function (scope, elem, attrs) {
          console.log('oauthButtons: initialized');
        }
      };
    })
    .controller('OAuth2Controller', OAuth2Controller);
    function OAuth2Controller () {
      console.log('OAuth2Controller: initialized');
    }
})();