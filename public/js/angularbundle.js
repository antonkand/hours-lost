(function () {
  'use strict';
  angular
    .module('HoursLostApp', [
      'OAuth2Module',
      'CalculatedResultModule'
    ])
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