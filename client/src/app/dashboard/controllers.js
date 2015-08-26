angular.module('controllers.dashboard', ['ui.router','ui.bootstrap','ngMessages',
, 'resources.projects'
, 'resources.backlogs'
, 'resources.users'
, 'resources.tasks'
, 'resources.issues'
])  
/*globalData.sendApiRequest('projects/stats').then(function(data){
				 $scope.projectsStatData=data;//2 calls!?
	   });  */

.controller('DashboardCtrl', [ 
                          '$scope','projectsStatData',
         function($scope,projectsStatData){
		   //console.log(projectsStatData.length);
		   $scope.projectsStatData=projectsStatData;
		   //$scope.myDevPrjs=globalData.devPrjs;
         // $scope.myPrdMgrPrjs=globalData.mgrPrjs;
	   }
])

