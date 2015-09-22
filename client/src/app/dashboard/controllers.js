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
                 '$scope','globalData',//'projectsStatData',
         function($scope,globalData){
                   $scope.gFilter='';
		   
		  // $scope.projectsStatData=projectsStatData;
		$scope.filter=function(){
		   
                   console.log('query:'+$scope.gFilter);
                   globalData.sendApiRequest('projects/stats',{tag: $scope.gFilter}).then(function (data){
                      $scope.projectsStatData=data;
                   })  

		}
	   }
])

