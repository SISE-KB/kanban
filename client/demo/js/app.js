'use strict';

/**********************************************************************
 * Main Application
 **********************************************************************/
angular.module('myApp', ['ngResource', 'ngRoute','ui.bootstrap', 'hc.marked','ngFileUpload'])
.constant('APP_CONFIG', {
   staticDir: '/static/'
  ,imagesDir: '/static/files/'
})
.config(function($routeProvider, $locationProvider, $httpProvider,markedProvider) {
    markedProvider.setOptions({gfm: true});

    $httpProvider.interceptors.push(function($q, $location) {
      return {
        response: function(response) {
          // do something on success
          return response;
        },
        responseError: function(response) {
          if (response.status === 401)
            $location.url('/login');
          return $q.reject(response);
        }
      };
    });

    var checkLoggedin = function($q,  $http, $location, $rootScope){
      // Initialize a new promise
      var deferred = $q.defer();
      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user){
        if (user.id == 0){
           $rootScope.errMsg = 'You need to log in.';
           $rootScope.user=null; 
           deferred.reject($rootScope.errMsg);
           $location.url('/login');
        } else {
			  $rootScope.user=user; 
              deferred.resolve(true);
        }
      });
      return deferred.promise;
    };
    
     var loadMsgs = function($q, $http){
      var deferred = $q.defer();
      $http.get('/api/messages').success(function(data){
           deferred.resolve(data);
       }).error(function(){
		  deferred.reject('load messages fail!');
	  });
      return deferred.promise;
    };
    
    var loadImages = function($q, $http){
      var deferred = $q.defer();
      $http.get('/images').success(function(data){
           deferred.resolve(data);
       }).error(function(){
		  deferred.reject('load images fail!');
	  });
      return deferred.promise;
    };

    $routeProvider
      .when('/', {
        templateUrl: '/static/views/home.html',
        controller: 'HomeCtrl',
        resolve: {
           data: loadMsgs
          ,files: loadImages
        }
      })
      .when('/admin', {
        templateUrl: '/static/views/admin.html',
        controller: 'AdminCtrl',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .when('/login', {
        templateUrl: '/static/views/login.html',
        controller: 'UserCtrl'
      })
      .when('/register', {
        templateUrl: '/static/views/register.html',
        controller: 'UserCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
}) // end of config()
.run(function($rootScope, $http,$log){
  
    var socket =$rootScope.socket=io();
   
    socket.on('message', function (data) {
        $rootScope.$broadcast('socket:message', data);
    });
   
    // Logout function is available in any pages
    $rootScope.logout = function(){
        $http.post('/logout');
    };
 });


