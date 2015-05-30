angular.module('app', [ 'ngAnimate','ngMessages', 'ui.router','ngDroplet'
,'ngSanitize',  'ui.select'
 ,'hc.marked', 'ui.bootstrap','ng-sortable'
,'services.i18nNotifications', 'services.httpRequestTracker','services.stateBuilderProvider',
,'directives.crud', 'security'
,'resources','controllers'
])
.config(['$stateProvider','$urlRouterProvider', 'securityAuthorizationProvider',
function ($stateProvider,$urlRouterProvider,securityAuthorizationProvider) {
  $urlRouterProvider.otherwise('/');
 // $locationProvider.html5Mode(true);     
  $stateProvider
    .state('dashboard',  {
	  url: '/',	
	  controller: 'DashboardCtrl',
      templateUrl: 'views/dashboard/index.tpl.html'
    }) 
     .state('home',  {
	  url: '/home',	
	 // controller: 'DashboardCtrl',
      template: '<h1>个人工作看板，正在开发......</h1>'
    }) 
    .state('upload',  {
	  url: '/upload',	
	  resolve: {
	    _currentUser: securityAuthorizationProvider.requireAuthenticatedUser// null if not login
	  },
      templateUrl: 'views/upload.tpl.html',
      controller: 'UploadCtrl'
    })
   			
}])
.run([        '$rootScope', '$state', '$stateParams','security',
    function ($rootScope,   $state,   $stateParams,security) {
      $rootScope.$state = $state
      $rootScope.$stateParams = $stateParams
    
      $rootScope.isAuthenticated = security.isAuthenticated
      $rootScope.isAdmin = security.isAdmin
   }
])
.controller('AppCtrl', [
           '$scope', 'i18nNotifications', 'localizedMessages',
 function($scope, i18nNotifications, localizedMessages) {
  $scope.notifications = i18nNotifications
  $scope.removeNotification = function (notification) {
    i18nNotifications.remove(notification)
  }
  $scope.$on('$stateChangeError', function(event, current, previous, rejection){
    i18nNotifications.pushForCurrentRoute('errors.state.changeError', 'error', {}, {rejection: rejection})
  })
}])
.controller('HeaderCtrl', [
            '$scope',  'security', 'notifications', 'httpRequestTracker',
  function ($scope,  security,  notifications, httpRequestTracker) {

  
  $scope.hasPendingRequests = function () {
    return httpRequestTracker.hasPendingRequests()
  }
  $scope.home = function () {
	  
	  if(security.isAuthenticated()){
		 console.log("home");
	     $scope.$state.go('home');
	 }
	  else{
		 console.log("dashboard");
         $scope.$state.go('dashboard');
	 }
  }
 }])


