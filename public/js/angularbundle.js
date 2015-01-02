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
(function () {
  'use strict';
  angular
    .module('CustomizationSliderModule', [])
    .directive('customizationSliders', function () {
      return {
        scope: {
          estimates: '='
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
  CustomizationSliderController.$inject = ["$scope"];
})();