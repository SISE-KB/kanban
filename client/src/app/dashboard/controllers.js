angular.module('controllers.dashboard', ['ui.router','ui.bootstrap','ngMessages',
, 'resources.projects'
, 'resources.backlogs'
, 'resources.users'
, 'resources.tasks'
, 'resources.issues'
])  
.controller('DashboardCtrl',   
              [ '$scope','globalData',
	function ($scope, globalData) {
		 globalData.sendApiRequest('projects/stats').then(function(data){
				console.log(data);
		       $scope.projects=data;
		      
	   });  
}]);

