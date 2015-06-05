angular.module('app', [ 'ngAnimate','ngMessages', 'ui.router','ngDroplet'
,'ngSanitize',  'ui.select'
 ,'hc.marked', 'ui.bootstrap','ng-sortable'
,'services.i18nNotifications', 'services.httpRequestTracker','services.stateBuilderProvider'
,'directives.crud', 'security','filters'
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
	    controller: 'HomeCtrl',
        template: '<div><h1>个人工作看板，正在开发......</h1><span>产品代表：{{myPrdMgrPrjs}};参与开发：{{myDevPrjs}}</span><div>'
    }) 
    .state('upload',  {
	    url: '/upload',	
	    resolve: {
	       currentUser: securityAuthorizationProvider.requireAuthenticatedUser// null if not login
	    },
      templateUrl: 'views/upload.tpl.html',
      controller: 'UploadCtrl'
    })
   			
}])
.run([           '$rootScope', '$state', '$stateParams','$log','security','globalData',
    function ($rootScope,     $state,     $stateParams,    $log,    security,    globalData) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
      $rootScope.isAuthenticated = security.isAuthenticated;
      $rootScope.isAdmin = security.isAdmin;
      $rootScope.$on('user:authenticated', function(event,user){
		  $log.info('user:authenticated',user);
		  globalData.setCurrentUser(user);
	 });	  
   }
])
.controller('HomeCtrl', [
            '$scope','globalData',
  function ( $scope,  globalData) {
	  $scope.myDevPrjs=globalData.devPrjs;
      $scope.myPrdMgrPrjs=globalData.mgrPrjs;
 }])
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
  $scope.$on('$stateChangeStart', 
    function(event, toState, toParams, fromState, fromParams){ 
        //event.preventDefault(); 
		//console.log(toState.name,toParams)
    })
}])
.controller('HeaderCtrl', [
            '$scope', 'security','httpRequestTracker',
  function ( $scope,   security,  httpRequestTracker) {

  
  $scope.hasPendingRequests = function () {
    return httpRequestTracker.hasPendingRequests()
  }
  $scope.home = function () {
	  
	  if(security.isAuthenticated()){
	     $scope.$state.go('home')
	 }
	  else{
		    $scope.$state.go('dashboard')
	 }
  }
 }])
 


