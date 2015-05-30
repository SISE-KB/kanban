angular.module('controllers.dashboard', ['ui.router','ui.bootstrap'])  
.controller('DashboardCtrl',   
              [ '$scope', '$state', '$stateParams', 
	function ($scope,   $state,   $stateParams) {
		$scope.data=[
		{ prjName: '神庙逃亡'
		  ,prdMgrImage:'1.jpg'
		  ,backlogsOk:	[
		      {name:'backlog1', effort:9}
             ,{name:'backlog2',effort:9}
             ,{name:'backlog3',effort:12}
		  ]
		 ,backlogsTodo:	[
		      {name:'backlog4', effort:9}
             ,{name:'backlog5', effort:9}
	     ]
	  }
    ,{    prjName: '顽皮鳄鱼爱洗澡'
		 ,prdMgrImage:'2.jpg'
		 ,backlogsOk:	[
		      {name:'backlog5', effort:10}
             ,{name:'backlog6',effort:8}
      	  ]
		 ,backlogsTodo:	[
		      {name:'backlog7', effort:9}
	     ]
	  }
    ,{    prjName: '机械迷城'
		 ,prdMgrImage:'3.jpg'
		 ,backlogsOk:	[
		      {name:'backlog8', effort:10}
             ,{name:'backlog9',effort:8}
      	  ]
		 ,backlogsTodo:	[
		      {name:'backlog10', effort:9}
	     ]
	  }
  ,{    prjName: '地域边境'
		 ,prdMgrImage:'4.jpg'
		 ,backlogsOk:	[
		      {name:'backlog11', effort:10}
             ,{name:'backlog12',effort:8}
      	  ]
		 ,backlogsTodo:	[
		      {name:'backlog13', effort:9}
	     ]
	  }
    ];
}])
