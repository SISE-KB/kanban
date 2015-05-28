angular.module('controllers.backlogs', ['ui.router','ngMessages'
, 'services.i18nNotifications'
, 'resources.projects'
, 'resources.backlogs'
, 'resources.users'
]) 
 .config(['$stateProvider', 
 function($stateProvider){
	var projectId = ['$stateParams', function($stateParams) {
      return $stateParams.projectId
    }]
    
  	$stateProvider
		.state('backlogs-list', {
				url: "backlogs/:projectId",
				templateUrl: 'views/projects/backlogs/list.tpl.html',
				resolve: {
					 backlogs : ['$stateParams', 'Backlog', 
					    function($stateParams, Backlog){
                           return Backlog.forProject($stateParams.projectId)
                        }]
		        },
				controller: 'BacklogsListCtrl'
		})
		.state('backlogs-create', {
				url: 'backlogs/create/:projectId',
				templateUrl: 'views/projects/backlogs/edit.tpl.html',
				controller:  'BacklogsCreateCtrl'
		})
 }])

 .controller('BacklogsListCtrl', [
            'security','$scope', '$state','$stateParams','backlogs','Project',
    function(security,$scope,   $state,  $stateParams,backlogs,Project){
      $scope.data = backlogs;
	  var mgrId=security.currentUser.id;
	  console.log(mgrId);
      Project.forProductMgr(mgrId).then(function(data){
	    console.log(data);
		$scope.myPrjs=data;
	  });
					  
      $scope.create = function () {
		 $state.go('backlogs-create', 
		  {projectId:$stateParams.projectId}
		  )
	  };
   
  }])
  .controller('BacklogsCreateCtrl', [
             '$scope',  'Backlog',  'i18nNotifications','$state','$stateParams',
    function($scope,   Backlog,    i18nNotifications,$state,$stateParams){
      $scope.item = new Backlog()
      $scope.item.projectId=$stateParams.projectId
      $scope.onSave = function (item) {
			i18nNotifications.pushForNextRoute('crud.save.success', 'success', {id : item.name})
			$state.go('backlogs-list', $stateParams) 
	  }
	  $scope.onError = function() {
			i18nNotifications.pushForCurrentRoute('crud.save.error', 'danger')
	  }
   
  }])
