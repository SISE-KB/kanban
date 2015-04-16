angular.module('ngdemo', ['ngRoute', 'ngdemo.controllers']).
    config(['$routeProvider','$locationProvider', function ($routeProvider,$locationProvider) {
		//$locationProvider.html5Mode(true);
        $routeProvider.when('/date-picker', {templateUrl: 'datepicker.html', controller: 'MixedContentController'});
        $routeProvider.otherwise({redirectTo: '/date-picker'});
    }]); 