angular.module('app', [  'ui.bootstrap.tpls', 'ui.router','ngSanitize',  'ui.select', 'hc.marked',
 // 'services.breadcrumbs',
  'services.i18nNotifications',
  'services.httpRequestTracker',
  'security',
  'directives.crud',
   'messages',
  /*'dashboard',
  'projects',
  'admin',
'ngAnimate','ngSanitize',  'ui.select', 'hc.marked',
  */
  'templates.app',
  'templates.common',
  ])

.config(
  [          '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
      $urlRouterProvider
       .when('/mes?id', '/messages/:id')
      .otherwise('/messages')
      
      $stateProvider
        .state("home", {
          url: "/",
          templateUrl: 'home.tpl.html'

        })
    }
])      
.run(
  [          '$rootScope', '$state', '$stateParams','security', 
    function ($rootScope,   $state,   $stateParams,security) {

    // It's very handy to add references to $state and $stateParams to the $rootScope
    // so that you can access them from any scope within your applications.For example,
    // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
    // to active whenever 'contacts.list' or one of its decendents is active.
      $rootScope.$state = $state
      $rootScope.$stateParams = $stateParams
      $rootScope.currentUser=security.requestCurrentUser()
    }
  ]
)
.controller('AppCtrl', [
            '$scope', 'i18nNotifications', 'localizedMessages',
  function($scope,    i18nNotifications,    localizedMessages) {

  $scope.notifications = i18nNotifications;

  $scope.removeNotification = function (notification) {
    i18nNotifications.remove(notification);
  };

  $scope.$on('$routeChangeError', function(event, current, previous, rejection){
    i18nNotifications.pushForCurrentRoute('errors.route.changeError', 'error', {}, {rejection: rejection});
  });
}])
.controller('HeaderCtrl', [
       '$scope',  '$state', 'security',  'notifications', 'httpRequestTracker',
  function ($scope, $state, security,  notifications, httpRequestTracker) {
  //$scope.breadcrumbs = breadcrumbs;
  $scope.isAuthenticated = security.isAuthenticated;
  $scope.isAdmin = security.isAdmin;

  $scope.home = function () {
    if (security.isAuthenticated()) {
      $state.go('messages');
    } else {
	//	 $state.go('messages');
      $state.go('home');
    }
  };

  $scope.isNavbarActive = function (navBarPath) {
    return true;////navBarPath === breadcrumbs.getFirst().name;
  };

  $scope.hasPendingRequests = function () {
    return httpRequestTracker.hasPendingRequests();
  };
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
