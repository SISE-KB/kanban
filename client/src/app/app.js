angular.module('app', [ 'ngAnimate','ngMessages', 'ui.router','ngSanitize',  'ui.select', 'hc.marked', 'ui.bootstrap', 
 'services.i18nNotifications', 'services.httpRequestTracker', 'directives.crud', 'security',
 'resources','states','controllers'
])
.config(['$stateProvider','$urlRouterProvider',
function ($stateProvider,$urlRouterProvider) {
  $urlRouterProvider
       .otherwise('/home');
        
  $stateProvider
    .state('home',  {
	  url: '/home',	
      templateUrl: 'views/home.tpl.html'
    })
    .state('about',  {
	  url: '/about',	
      template: '<p>about us</p>'
    })   
}])
.run(
  [          '$rootScope', '$state', '$stateParams','security', 
    function ($rootScope,   $state,   $stateParams,security) {

    // It's very handy to add references to $state and $stateParams to the $rootScope
    // so that you can access them from any scope within your applications.For example,
    // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
    // to active whenever 'contacts.list' or one of its decendents is active.
      $rootScope.$state = $state
      $rootScope.$stateParams = $stateParams
   //   $rootScope.currentUser=security.requestCurrentUser()
    }
  ]
)

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

