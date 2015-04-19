angular.module('ngdemo', [ 
 'ui.router', 
 'ui.bootstrap'])
.config(['$stateProvider','$urlRouterProvider',function ($stateProvider,$urlRouterProvider) {
  $urlRouterProvider
        // The `when` method says if the url is ever the 1st param, then redirect to the 2nd param
        // Here we are just setting up some convenience urls.
        .when('/c?id', '/contacts/:id')
        .when('/user/:id', '/contacts/:id')
        .otherwise('/');
        
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'views/datepicker.html'
     // controller: 'MixedContentController'
      })
    .state('app', {
      abstract: true,
      data: {
        requireLogin: true // this property will apply to all children of 'app'
      }
    })
    .state('app.dashboard', {
      templateUrl: 'views/dashboard.html'
     });
   
}])
.controller('DatepickerDemoCtrl', ['$scope', function($scope) {
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.showWeeks = true;
  $scope.toggleWeeks = function () {
    $scope.showWeeks = ! $scope.showWeeks;
  };

  $scope.clear = function () {
    $scope.dt = null; 
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = ( $scope.minDate ) ? null : new Date();
  };
  $scope.toggleMin(); 

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 1
  };

  $scope.formats = [ 'yyyy/MM/dd', 'shortDate'];
  $scope.format = $scope.formats[0];
}]);

