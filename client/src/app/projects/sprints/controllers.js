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
				url: '/tasks/:sprintId',
				templateUrl: 'views/projects/sprints/tasks.tpl.html',
				controller: 'TasksCtrl'
		})	
		.state('sprints.task', {
				url: '/task/:taskId',
				templateUrl: 'views/projects/sprints/task-edit.tpl.html',
				controller: 'TasksEditCtrl'
/*
				 views: {
                   '@sprints': { 
				         templateUrl: 'views/projects/sprints/task-edit.tpl.html'
				      }
				      
				 }     */ 

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
			 animation: 200,
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
 			 $scope.currentSprint=sprint;
			 $scope.$state.go('sprints.tasks', {projectId:projectId,sprintId:sprint._id});
			 
			
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
		var projectId = $scope.$stateParams.projectId;
		var sprintId= $scope.$stateParams.sprintId;
		$log.debug(globalData.exchange);
				
		Task.forSprint(sprintId).then(function(ds){
			$scope.tasks=ds;
		    $log.debug('load tasks',ds);
		 });
		

      	$scope.edit = function (task) {
			globalData.exchange=task;
			
			$scope.$state.go('sprints.task',{projectId:projectId,taskId:task._id}); 
	    };
	    $scope.add = function () {
		    var item=new Task();
		    item.name= $scope.taskText;
		    item.state='TODO';
		    item.projectId=projectId;
		    item.sprintId=sprintId;
		    item.$save().then(function(data){
			  $scope.tasks.push(data); 
			  $log.debug('save Task:',data);
			});
		    
		   
		    
		};
	
	    $scope.remove = function (task, index, event) {
			event.stopPropagation();
			$scope.tasks.splice(index,1);
			task.$remove();
		}  
  }])
.controller('TasksEditCtrl', [
             '$scope', '$log', 'Project','User','globalData',
    function($scope,  $log, Project,User,globalData){
	   // var tasks=globalData.exchange[0];
		 $scope.task=globalData.exchange;
		 if(!$scope.task) $log.debug('not ID',$scope.task);
		 Project.getById($scope.$stateParams.projectId).then(function(prj){
			User.getByObjectIds(prj.teamMembers).then(function(users){
				$log.debug('load  prj members:',users);
				$scope.users= users;
			});
		  });	
		
		$scope.save = function () {
		  // $log.debug('before save:',$scope.task);
	       $scope.task.$update()
		   .then(function(data){
		       $scope.task=data;
			  // $log.debug('after save:',data);
			  var args={projectId:$scope.$stateParams.projectId};
	          args.sprintId=$scope.task.sprintId;
			 // globalData.removeItemFromArray(tasks,$scope.task);
			 // tasks.push(data);
	          $scope.$state.go('sprints.tasks', args);
		   });
		   
	      
	    }   
		
 }])
 .controller('SprintsEditCtrl', [
             '$scope', '$log',  'Sprint','i18nNotifications','globalData',
    function($scope,  $log,     Sprint,    i18nNotifications,globalData){
      $scope.item=globalData.exchange;

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
