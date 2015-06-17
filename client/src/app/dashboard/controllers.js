angular.module('controllers.dashboard', ['ui.router','ui.bootstrap','ngMessages',
, 'services.i18nNotifications'
, 'resources.projects'
, 'resources.backlogs'
, 'resources.users'
, 'resources.tasks'
, 'resources.issues'
])  

.controller('DashboardCtrl',   
              [ 'crudContrllersHelp','Project','User','Task','$log','$modal','$scope', '$state', '$stateParams','globalData','Backlog', 'Issue',
	function ( crudContrllersHelp, Project,User,Task,$log,$modal,$scope,   $state,   $stateParams,globalData,Backlog,Issue) {
		 $scope.projects=[]
         globalData.sendApiRequest('projects/load')
         .then(function(data){
			 $scope.projects=data;
			  data.forEach(function(item){
			      User.getById(item.productOwnerId).then(function(user){
					   $log.debug('user',user);
					   item.mgrImage=user.code+'/'+user.image;
					   $log.debug('item.mgrImage',item.mgrImage);
				  });
				  Backlog.forProject(item._id,'TODO').then(function(ds){
					   item.todoItems=ds;
					   $log.debug(item);
				  });
				  Backlog.forProject(item._id,'OK').then(function(ds){
					   item.okItems=ds;
					   $log.debug(item);
				  });
				  Task.forProject(item._id).then(function(ds){
			           item.tasks=ds;
		           $log.debug('load tasks',ds);
		             });
				  Issue.forProject(item._id).then(function(ds){
			           item.issues=ds;
		           $log.debug('load issues',ds);
		             });
			  });
		});
			 
		/* 
		$scope.data=[
		{ prjName: '神庙逃亡'
		  ,prdMgrImage:'1.jpg'
		  ,backlogsTODO:	[
		      {name:'backlog1',effort:9}
             ,{name:'backlog2',effort:9}
             ,{name:'backlog3',effort:12}
		  ]  
		  ,backlogsOK:	[
		      {name:'backlog23', effort:9}
             ,{name:'backlog24',effort:9}
             ,{name:'backlog25',effort:12}
		  ]
		 ,TASK:	[
		      {name:'backlog4', effort:9}
             ,{name:'backlog5', effort:9}
	     ]
		 ,BUG:[
		      {name:'backlog14', effort:9}
             ,{name:'backlog15', effort:9}
	     ]
	  }
    ,{    prjName: '顽皮鳄鱼爱洗澡'
		 ,prdMgrImage:'2.jpg'
		 ,backlogsTODO:	[
		      {name:'backlog5', effort:10}
             ,{name:'backlog6',effort:8}
      	  ]
		 ,backlogsOK:	[
		      {name:'backlog26', effort:10}
             ,{name:'backlog27',effort:8}
      	  ]
		 ,TASK:	[
		      {name:'backlog7', effort:9}
	     ]
		 ,BUG:[
		      {name:'backlog17', effort:9}
             ,{name:'backlog18', effort:9}
	     ]
	  }
    ,{    prjName: '机械迷城'
		 ,prdMgrImage:'3.jpg'
		 ,backlogsTODO:	[
		      {name:'backlog8', effort:10}
             ,{name:'backlog9',effort:8}
      	  ]
		 ,backlogsOK:	[
		      {name:'backlog28', effort:10}
             ,{name:'backlog29',effort:8}
      	  ]
		 ,TASK:	[
		      {name:'backlog10', effort:9}
	     ]
		 ,BUG:[
		      {name:'backlog19', effort:9}
             ,{name:'backlog20', effort:9}
	     ]
	  }
  ,{    prjName: '地域边境'
		 ,prdMgrImage:'4.jpg'
		 ,backlogsTODO:	[
		      {name:'backlog11', effort:10}
             ,{name:'backlog12',effort:8}
      	  ]
		 ,backlogsOK:	[
		      {name:'backlog31', effort:10}
             ,{name:'backlog32',effort:8}
      	  ]
		 ,TASK:	[
		      {name:'backlog13', effort:9}
	     ]
		 ,BUG:[
		      {name:'backlog21', effort:9}
             ,{name:'backlog21', effort:9}
	     ]
	  }
    ]; */
}])
