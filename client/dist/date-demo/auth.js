angular.module('AuthDemo', [
  'ui.router', 
  'ui.bootstrap',
  'ngAnimate'
])
.config(function ($httpProvider,$urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');
  $httpProvider.interceptors.push(function ($timeout, $q, $injector) {
    var loginModal, $http, $state;

    // this trick must be done so that we don't receive
    // `Uncaught Error: [$injector:cdep] Circular dependency found`
    $timeout(function () {
      loginModal = $injector.get('loginModal');
      $http = $injector.get('$http');
      $state = $injector.get('$state');
    });

    return {
      responseError: function (rejection) {
        if (rejection.status !== 401) {
          return rejection;
        }

        var deferred = $q.defer();

        loginModal()
          .then(function () {
            deferred.resolve( $http(rejection.config) );
          })
          .catch(function () {
            $state.go('home');
            deferred.reject(rejection);
          });

        return deferred.promise;
      }
    };
  });

})
.controller('MainController', function($scope) {
    
    // we will store all of our form data in this object
    $scope.myData = {};
    
    // function to process the form
    $scope.processForm = function() {
        alert('OK!');
    };
    
})

.run(function ($rootScope, $state, loginModal) {

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    var requireLogin = toState.data.requireLogin;

    if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
      event.preventDefault();

      loginModal()
        .then(function () {
          return $state.go(toState.name, toParams);
        })
        .catch(function () {
          return $state.go('home');
        });
    }
  });

});
