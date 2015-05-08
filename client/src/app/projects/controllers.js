angular.module('controllers.projects', ['ui.router','ngMessages'
, 'services.i18nNotifications'
, 'resources.projects'
, 'resources.users'
])  
.controller('ProjectsMainCtrl',   [
               'crudContrllersHelp','$scope', '$state', '$stateParams', 'i18nNotifications','Project','User',
	function ( crudContrllersHelp,$scope,   $state,   $stateParams,    i18nNotifications, Project,User) {
 		User.all().then(function(ds){
			$scope.users =ds
		})
		crudContrllersHelp.initMain('Project','name',$scope,   $state,   $stateParams)     
	}
])
.controller('ProjectsListCtrl',   [
                'crudContrllersHelp','$scope', '$state', '$stateParams', 'i18nNotifications', 
	function ( crudContrllersHelp, $scope,   $state,   $stateParams,    i18nNotifications) {
		crudContrllersHelp.initList('Project','name',$scope,   $state,   $stateParams)
		$scope.backlogs=function (item) {
			$state.go('backlogs-list', {projectId: item.$id()})
		}
	

	}
])
.controller('ProjectsDetailCtrl',   [
                'crudContrllersHelp','$scope','$stateParams', '$state',
	function ( crudContrllersHelp, $scope,$stateParams,   $state) {
		crudContrllersHelp.initDetail('Project','name',$scope,   $state,   $stateParams)

	}
])

.controller('ProjectsCreateCtrl',   [
                '$scope', 'Project',
	function (  $scope,   Project) {
		$scope.item = new Project()
		$scope.item.iterationDuration=4
		$scope.item.isSample=false

	}
])

.controller('ProjectsEditCtrl',   [
                '$scope', '$stateParams', '$state',
	function (  $scope,   $stateParams,   $state) {
		$scope.item = $scope.findById( $stateParams.itemId)

	}
])
