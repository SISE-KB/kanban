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
      $scope.doneItems = backlogs;
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
	    
		$scope.doingItems = [];
		$scope.todoItems = []; 
		$scope.okItems = [];
		 
        $scope.todoConfig = {
		    animation: 150,
            group: {name:'todo',put: false},
			 onRemove:function(data){
			   console.log("onRemove--",data.model,data.oldIndex) 
			}
        };
		$scope.doingConfig = {
			animation: 150,
             group: {name:'doing', put: false},
			 onAdd:function(data){
			   data.model.state="DOING";
			}
		};
		$scope.doneConfig = {
			animation: 150,
            group: {name:'done',put: false},
			onAdd:function(data){
			   data.model.state="DONE";
			   console.log("onAdd--",data.model,data.newIndex) 
			}
		};
		$scope.okConfig = {
			animation: 150,
            group: {name:'ok',put: ['done']},
			onAdd:function(data){
			   data.model.state="OK";
			   console.log("onAdd--",data.model,data.newIndex) 
			}
		};
		
   
  }])
  .controller('TodoController',[
             '$scope',
	function ($scope) {
		$scope.addTodo = function () {
			$scope.items1.push({name:$scope.todoName,text: $scope.todoText,
								catalog:$scope.todoCatalog,projectId :$scope.todoProjectId,
								priority:$scope.todoPriority,estimation:$scope.todoEstimation,
								state:'todo'});
			$scope.todoName = '';
		}
	}
  ])
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
