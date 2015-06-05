angular.module('controllers.sprints', ['ui.router','ngMessages'
, 'services.i18nNotifications'
, 'resources.projects'
, 'resources.sprints'
, 'resources.backlogs'
, 'resources.tasks'
]) 
 .config(['$stateProvider', 
 function($stateProvider){
	var projectId = ['$stateParams', function($stateParams) {
      return $stateParams.projectId
    }]
	
    
  	$stateProvider
		.state('sprints', {
				url: "/sprints/:projectId",
				templateUrl: 'views/projects/sprints/index.tpl.html',
				controller: 'SprintsCtrl'
				
		})
		.state('sprints.view', {
				url: '/view',
				templateUrl: 'views/projects/sprints/view.tpl.html'
		})
	  .state('sprints.edit', {
				url: '/edit/:sprintId',//sprints/:projectId
				templateUrl: 'views/projects/sprints/edit.tpl.html',
				controller:  'SprintsEditCtrl'
		})

		.state('sprints.tasks', {
				url: '/tasks',
				templateUrl: 'views/projects/sprints/tasks.tpl.html',
				controller: 'TasksCtrl'
		})	
		.state('sprints.tasks.edit', {
				url: '/edit',
				 views: {
                   '@sprints': {
				         templateUrl: 'views/projects/sprints/task-edit.tpl.html'
				      }
				 }      

		});	
	
 }])

 .controller('SprintsCtrl', [
              '$scope', '$log','Sprint','Backlog','globalData',
    function($scope,  $log, Sprint,  Backlog,globalData){
		var projectId = $scope.$stateParams.projectId;
		 Backlog.forProject(projectId,'TODO')
		  .then(function(data){
			  $scope.todoBacklogs =data;
			  $log.debug("TODO Backlogs",data);
		  });
         Sprint.forProject(projectId)
         .then(function(data){
			 $scope.sprints =data;
			 data.forEach(function(item){
				 $scope.currentSprint=item;
				  Backlog.forSprint(item._id).then(function(ds){
					   item.items=ds;
					  // $log.debug(item);
				  });
				
			 });
			 
		});	 
		
  
		$scope.changeCurSprint=function(sprint){
			  $scope.currentSprint=sprint;
		}
		$scope.changeBacklogState=function(data,state){
			 data.state=state;
			 var args={id: data._id,state: data.state,sprintId: data.sprintId};
			 globalData.sendApiRequest("backlogs/update",args);
			   
		}
       $scope.todoConfig = {
		    animation: 150,
            group: {name:'todo',put: ['doing']},
            onAdd:function(item){
			   item.model.sprintId=null;
			   $scope.changeBacklogState(item.model,'TODO');
			}
	    };
		$scope.doingConfig = {
			animation: 300,
             group: {name:'doing', put: ['todo','doing']},
			 onAdd:function(item){
			   item.model.sprintId=!$scope.currentSprint?null:$scope.currentSprint._id;
			   $scope.changeBacklogState(item.model,'DOING');
			   
			}
		};
	
		
		    
		$scope.addSprint = function () {
		    var item=new Sprint();
		    item.name= $scope.newText;
		    item.state='TODO';
		    item.projectId=projectId;
		    item.$save().then(function(data){
			    $log.debug('save Sprint:',data);
			    $scope.currentSprint=data;
			     data.items=[]
			     $scope.sprints.push(data);
			},function(err){
				 $log.debug('save err:',err);
			});
		   
			$scope.newText = '';
		};
    
		 $scope.showBacklog= function (item) {
			 $scope.curBacklog=item;
			 $log.debug("showBacklog",item);
			 $scope.$state.go('sprints.view',  $scope.$stateParams);
		 }
		  $scope.showTasks= function (sprint) {
			  globalData.exchange=[ projectId,sprint._id];
			   $scope.$state.go('sprints.tasks',  $scope.$stateParams);
			 
			
		 }
	    $scope.edit = function (item) {
			globalData.exchange=item;
			$scope.currentSprint=item;
			$scope.$state.go('sprints.edit', {projectId:projectId,sprintId:item._id});
			
	   };
	
	
  }])
  .controller('TasksCtrl', [
             '$scope', '$log',  'Task','globalData',
    function($scope,  $log,     Task,  globalData){
		//$log.debug(globalData.exchange);
		var projectId=globalData.exchange[0];
		var sprintId=globalData.exchange[1];
		
		Task.forSprint(sprintId).then(function(ds){
			   $scope.tasks=ds;
		       $log.debug('load tasks',ds);
		 });
		

      	$scope.edit = function (task) {
			$scope.task=task;
			$log.debug('cur task',$scope.task);
			$scope.$state.go('sprints.tasks.edit',  $scope.$stateParams);
	    };
	    $scope.add = function () {
		    var item=new Task();
		    item.name= $scope.taskText;
		    item.state='TODO';
		    item.projectId=projectId;
		    item.sprintId=sprintId;
		    item.$save();
		    $scope.tasks.push(item);
		    $log.debug('save Task:',item);
		    
		};
		$scope.save = function (task) {
	       task.$update();
	       $scope.$state.go('sprints.tasks',  $scope.$stateParams);
	    }   
	    $scope.remove = function (task, index, event) {
			event.stopPropagation();
			$scope.tasks.splice(index,1);
			task.$remove();
		}  
  }])
 .controller('SprintsEditCtrl', [
             '$scope', '$log',  'Sprint','i18nNotifications','globalData',
    function($scope,  $log,     Sprint,    i18nNotifications,globalData){
      $scope.item=globalData.exchange;
      //globalData.exchange=null;
      $log.debug($scope.item);
      var projectId = $scope.$stateParams.projectId;
      
      var  sum=function() {
			var count = 0;
			angular.forEach($scope.item.items, function (todo) {
					count += !todo.estimation?0:todo.estimation;
					$log.debug(todo);
			});
			$log.debug(count);
			return count;
	   };
		
        $scope.item.capacity= sum();
		

		$scope.save = function() {
			var item=$scope.item;
			item.$update();
			i18nNotifications.pushForCurrentRoute('crud.save.success', 'success', {id : item['name']});
			$scope.$state.go('sprints',{projectId:projectId}); 
		};
	   
  }])
