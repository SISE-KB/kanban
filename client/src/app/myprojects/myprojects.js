angular.module('prj-dashboard', ['ui.router','resources.projects'])

.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('prj-dashboard', {
    templateUrl:'views/myprojects/prj-dashboard.tpl.html',
    controller:'ProjectDashboardCtrl',
  })
}])

.controller('ProjectDashboardCtrl', [
          '$http','$scope', 'Project',
function ($http,$scope,Project) {
	$scope.projects = [
	 {_id:1,name:'prj1'}
	,{_id:2,name:'prj2'}]
	var baseURL= 'http://localhost:3000/api/'
  $http.post(baseURL+'project/projectsForUser',{userid:'admin'})
  .then(function(resp){
	  console.log('api--',resp.data)
  })
  /*Project.all().then(function(prjs){
	  $scope.projects = prjs
	  console.log(prjs[0].name)
  })*/
  $scope.tasks = [
      {name:'T1',estimation:2,remaining:1}
     ,{name:'T2',estimation:6,remaining:4}
  ]
}])
