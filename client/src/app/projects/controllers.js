angular.module('controllers.projects', ['ui.router','ngMessages'
, 'services.i18nNotifications'
, 'resources.projects'
, 'resources.users'
])  
.controller('ProjectsMainCtrl',   [
               'crudContrllersHelp','$scope', '$state', '$stateParams', 'globalData',
	function ( crudContrllersHelp,$scope,   $state,   $stateParams,  globalData) {
         $scope.users=[]
         globalData.sendApiRequest('users/load')
         .then(function(data){
			 $scope.users=data;
		}) ;
		 crudContrllersHelp.initMain('Project','name',$scope,   $state,   $stateParams)     
	}
])
.controller('ProjectsListCtrl',   [
                'crudContrllersHelp',  '$scope', '$state', '$stateParams', 'globalData',
	function ( crudContrllersHelp, $scope,     $state,     $stateParams,     globalData) {
		crudContrllersHelp.initList('Project','name',$scope,   $state,   $stateParams);
			$scope.backlogs=function (item) {
			$state.go('backlogs', {projectId: item.$id()})
		}
		$scope.sprints=function (item) {
			$state.go('sprints', {projectId: item.$id()})
		}
		$scope.issues=function (item) {
			globalData.exchangeData={targetType:'项目',target: item.name
				                            ,projectId:item.$id(),backlogId:null}
			$state.go('issues.create')
		}
		$scope.isProductMgr=function(item) {
		    if(!globalData.currentUser) return false;
			return item.productOwner==globalData.currentUser.id
		}
		$scope.isDevMgr=function(item) {
			if(!globalData.currentUser) return false;
			return item.procMaster==globalData.currentUser.id
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
		$scope.item.state='TODO'
		$scope.isNew=true

	}
])

.controller('ProjectsEditCtrl',   [
                '$scope', '$stateParams', '$state',
	function (  $scope,   $stateParams,   $state) {
		$scope.item = $scope.findById( $stateParams.itemId)
		$scope.isNew=false

	}
])
