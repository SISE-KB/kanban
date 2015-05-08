angular.module('controllers.issues', 
['ui.router'
, 'services.i18nNotifications'
, 'resources.users'
, 'resources.issues'
])  

.controller('IssuesMainCtrl',   [
               'crudContrllersHelp','$scope', '$state', '$stateParams', 'User',
	function ( crudContrllersHelp,$scope,   $state,   $stateParams,   User) {
		
       crudContrllersHelp.initMain('Issue','name',$scope,   $state,   $stateParams)
   
		User.all().then(function(ds){
			$scope.users =ds
	   })
	
		$scope.checkDate= function(item){
			var now = new Date(Date.now())
			if(!item.regDate)
				item.regDate=now
			if(!item.closeDate)
				item.closeDate= now.setDate(now.getDate()+14)
		}

	}
])
.controller('IssuesListCtrl',   [
                 'crudContrllersHelp','$scope', '$state', '$stateParams', 
	function ( crudContrllersHelp, $scope,   $state,   $stateParams) {
		crudContrllersHelp.initList('Issue','name',$scope,   $state,   $stateParams)
	}
])
.controller('IssuesDetailCtrl',   [
                 'crudContrllersHelp','$scope','$stateParams', '$state',
	function ( crudContrllersHelp, $scope,$stateParams,   $state) {
		crudContrllersHelp.initDetail('Issue','name',$scope,   $state,   $stateParams)
	}
])

.controller('IssuesCreateCtrl',   [
                '$scope', 'Issue',
	function (  $scope,   Issue) {
		$scope.item = new Issue()
		$scope.checkDate($scope.item)
	}
])

.controller('IssuesEditCtrl',   [
                '$scope', '$stateParams', '$state',
	function (  $scope,   $stateParams,   $state) {
		$scope.item = $scope.findById( $stateParams.itemId)
		$scope.checkDate($scope.item)
	}
])
