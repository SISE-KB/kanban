angular.module('app', [ 'ngAnimate','ngMessages', 'ui.router'
//,'ngSanitize',  'ui.select'
,'hc.marked', 'ui.bootstrap'
,'services.i18nNotifications', 'services.httpRequestTracker','services.stateBuilderProvider',
,'directives.crud', 'security'
,'resources','controllers'
])
.config(['$stateProvider','$urlRouterProvider', 
function ($stateProvider,$urlRouterProvider) {
  $urlRouterProvider
       .otherwise('/');
        
  $stateProvider
    .state('home',  {
	  url: '/',	
      template: '<h1>项目状态看板.....</h1>'
    }) 
    .state('demo',  {
	  url: '/demo',	
      templateUrl: 'views/demo.tpl.html'
    })
   			
}])
.run(
  [          '$rootScope', '$state', '$stateParams','security',
    function ($rootScope,   $state,   $stateParams,security,stateBuilder) {
      $rootScope.$state = $state
      $rootScope.$stateParams = $stateParams
      $rootScope.currentUser=security.requestCurrentUser()
      $rootScope.isAuthenticated = security.isAuthenticated
      $rootScope.isAdmin = security.isAdmin
	  
    }
  ]
)
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
    if (security.isAuthenticated()) {
      $scope.$state.go('projects.list');
    } else {
      $scope.$state.go('home');
    }
  }
 }])


