angular.module('app', [ 'ngAnimate','ngMessages', 'ui.router','ngDroplet'
,'ngSanitize',  'ui.select'
 ,'hc.marked', 'ui.bootstrap','ng-sortable'
,'services.i18nNotifications', 'services.httpRequestTracker','services.stateBuilderProvider',
,'directives.crud', 'security'
,'resources','controllers'
])
.config(['$stateProvider','$urlRouterProvider', 'securityAuthorizationProvider',
function ($stateProvider,$urlRouterProvider,securityAuthorizationProvider) {
  $urlRouterProvider.otherwise('/');
 // $locationProvider.html5Mode(true);     
  $stateProvider
    .state('dashboard',  {
	  url: '/',	
	  controller: 'DashboardCtrl',
      templateUrl: 'views/dashboard/index.tpl.html'
    }) 
     .state('home',  {
	  url: '/home',	
	  controller: 'HomeCtrl',
	  resolve: {
	    myDevPrjs:securityAuthorizationProvider.getMyDevProjects
		,myPrdMgrPrjs:securityAuthorizationProvider.getMyPrdMgrPrjs
	  },
      template: '<h1>个人工作看板，正在开发......</h1><span>产品代表：{{myPrdMgrPrjs}};参与开发：{{myPrdMgrPrjs}}</span>'
    }) 
    .state('upload',  {
	  url: '/upload',	
	  resolve: {
	    currentUser: securityAuthorizationProvider.requireAuthenticatedUser// null if not login
	  },
      templateUrl: 'views/upload.tpl.html',
      controller: 'UploadCtrl'
    })
   			
}])
.run([        '$rootScope', '$state', '$stateParams','security',
    function ($rootScope,   $state,   $stateParams,security) {
      $rootScope.$state = $state
      $rootScope.$stateParams = $stateParams
      $rootScope.isAuthenticated = security.isAuthenticated
      $rootScope.isAdmin = security.isAdmin
   }
])
.controller('HomeCtrl', [
            '$scope', 'myDevPrjs','myPrdMgrPrjs',
  function ( $scope,   myDevPrjs,myPrdMgrPrjs) {
	  $scope.myDevPrjs=myDevPrjs
      $scope.myPrdMgrPrjs=myPrdMgrPrjs
    //console.log('myDevPrjs',myDevPrjs)
	//console.log('myPrdMgrPrjs',myPrdMgrPrjs)
 }])
.controller('AppCtrl', [
           '$scope', 'i18nNotifications', 'localizedMessages',
 function($scope, i18nNotifications, localizedMessages) {
  $scope.notifications = i18nNotifications
  $scope.removeNotification = function (notification) {
    i18nNotifications.remove(notification)
  }
  $scope.$on('$stateChangeError', function(event, current, previous, rejection){
    i18nNotifications.pushForCurrentRoute('errors.state.changeError', 'error', {}, {rejection: rejection})
  })
  $scope.$on('$stateChangeStart', 
    function(event, toState, toParams, fromState, fromParams){ 
        //event.preventDefault(); 
		console.log(toState.name,toParams)
    })
}])
.controller('HeaderCtrl', [
            '$scope', 'security','httpRequestTracker',
  function ( $scope,   security,  httpRequestTracker) {

  
  $scope.hasPendingRequests = function () {
    return httpRequestTracker.hasPendingRequests()
  }
  $scope.home = function () {
	  
	  if(security.isAuthenticated()){
	     $scope.$state.go('home')
	 }
	  else{
		// console.log("dashboard");
         $scope.$state.go('dashboard')
	 }
  }
 }])
 



angular.module('app')
.factory('crudContrllersHelp', [
          '$injector',
function ($injector) {
 var initMain = function (ResName,searchField,$scope,   $state,   $stateParams) {

		var Res = $injector.get(ResName);
		var i18nNotifications = $injector.get('i18nNotifications');

		var ressName=Res.getName()

		$scope._data = []//load from server
		$scope.users=[]

		$scope.query = ''
		$scope.visited=[]

		$scope.search=function() {
			var q={}
			q[searchField]=$scope.query
			Res.query(q).then(function(ds){
				$scope._data=ds
				$scope.visited=[]
				$state.go(ressName+'.list') 
		  })
	    }
		$scope.findById = function (id) {
			for (var i = 0; i < $scope._data.length; i++) {
				var rt=$scope._data[i]
				if ($scope._data[i].$id() == id)
					return rt
			}
			return null
		}
		
		$scope.removeFromArray = function (data,item) {
			var index = data.indexOf(item);
			if (index > -1)
				data.splice(index, 1);
		}
		$scope.addToVisited = function (item) {
			var index = $scope.visited.indexOf(item);
			if (index > -1) 
			$scope.visited.splice(index, 1);
			$scope.visited.push(item)
			while ($scope.visited.length>10)
				$scope.visited.shift()
		}
		$scope.onSave = function (item) {
			i18nNotifications.pushForNextRoute('crud.save.success', 'success', {id : item[searchField]})
			//console.log($state.current.name)
			var idx=$state.current.name.indexOf('create')
			//console.log(idx)
			if(idx > -1){
				$scope._data.push(item)
			}
			$state.go(ressName+'.list', $stateParams) 
		}
		$scope.onError = function() {
			i18nNotifications.pushForCurrentRoute('crud.save.error', 'danger')
		}
		$scope.onRemove = function(item) {
			i18nNotifications.pushForCurrentRoute('crud.remove.success', 'success', {id : item[searchField]})
			$scope.removeFromArray($scope._data,item)
			$scope.removeFromArray($scope.visited,item)
			$state.go(ressName+'.list', $stateParams) 
		}
	
  }
var initList = function (ResName,nameField,$scope,   $state,   $stateParams) {
		var i18nNotifications = $injector.get('i18nNotifications')
		var Res = $injector.get(ResName)

  		$scope.data = []// display items
		$scope.numPerPage=10
		$scope.currentPage = 1
		$scope.totalItems=0
		
		$scope.setPage = function (pageNo) {
			$scope.currentPage = pageNo
		}
       
		$scope.maxSize = 5


		$scope.$watch("currentPage + numPerPage + _data", function() {
			$scope.totalItems = $scope._data.length
			var begin = (($scope.currentPage - 1) * $scope.numPerPage)
				, end = begin + $scope.numPerPage

			if(end>$scope._data.length) 
				   end=$scope._data.length

			$scope.data = $scope._data.slice(begin, end)
		})
  
		$scope.remove = function(item, $index, $event) {
			// Don't let the click bubble up to the ng-click on the enclosing div, which will try to trigger
			// an edit of this item.
			$event.stopPropagation()
			item.$remove().then(function() {
				$scope.onRemove(item)
			}, function() {
				i18nNotifications.pushForCurrentRoute('crud.user.remove.error', 'danger', {id : item[nameField]})
			})
		}
		var ressName=Res.getName(false,false)
		$scope.view = function (item) {
			$state.go(ressName+'.detail', {itemId: item.$id()})
		}
		$scope.edit = function (item) {
			$state.go(ressName+'.edit', {itemId: item.$id()})
		}
		$scope.create = function () {
			$state.go(ressName+'.create')
		}
		
}
var initDetail = function (ResName,nameField,$scope,   $state,   $stateParams) {
		var i18nNotifications = $injector.get('i18nNotifications')
		var Res = $injector.get(ResName)
		$scope.item = $scope.findById( $stateParams.itemId)
		$scope.addToVisited($scope.item)
		var ressName=Res.getName(false,false)
		$scope.edit = function () {
			$state.go(ressName+'.edit', {itemId: $scope.item.$id()})
		}
		$scope.list = function () {
			$state.go(ressName+'.list')
		}
}
  return {
	  initMain:initMain
	,initDetail:initDetail
	,initList:initList  
  }
}])
  

angular.module('app').constant('I18N.MESSAGES', {
  'errors.state.changeError':'前端状态转换出错',
  'crud.save.success':"成功保存'{{id}}'",
  'crud.save.error':"保存出错...'{{id}}'",
  'crud.remove.success':"成功删除'{{id}}'",
  'crud.remove.error':"删除出错...'{{id}}'",

  'login.reason.notAuthorized':"无权操作！",
  'login.reason.notAuthenticated':"必须登录后才能访问！",
  'login.error.invalidCredentials': "登录失败，请检查输入是否正确！",
  'login.error.serverError': "服务端错误： {{exception}}."
});

angular.module('controllers',[
 'controllers.messages'
,'controllers.users'
,'controllers.projects'
,'controllers.backlogs'
,'controllers.issues'
,'controllers.dashboard'
])
angular.module('resources', [
 'resources.messages'
,'resources.users'
,'resources.projects'
,'resources.backlogs'
,'resources.issues'
])

angular.module('app')
.value('SERVER_CFG',{URL:'http://127.0.0.1:3000'})
.config(['stateBuilderProvider', 
function (stateBuilderProvider) {
   stateBuilderProvider.statesFor('User') 
   stateBuilderProvider.statesFor('Project')   	
   stateBuilderProvider.statesFor('Issue') 	
   stateBuilderProvider.statesFor('Message') 	
}])
.config(['uiSelectConfig', function(uiSelectConfig) {
  uiSelectConfig.theme = 'bootstrap';
}])





angular.module('app')
.controller('UploadCtrl', [
           '$scope', '$timeout','currentUser',
function ($scope, $timeout,currentUser) {
        $scope.interface = {};
        $scope.uploadCount = 0;
        $scope.success = false;
        $scope.error = false;
		console.log('currentUser',currentUser);
		$scope.interface.useParser=function (responseText) {
		   // console.log(responseText);
			return responseText;
		};
        // Listen for when the interface has been configured.
        $scope.$on('$dropletReady', function whenDropletReady() {
            $scope.interface.allowedExtensions(['png', 'jpg', 'gif','ppt', 'doc', 'docx']);
           // console.log($scope.currentUser);
            $scope.interface.setRequestUrl('upload'+'/'+currentUser.mobileNo);
            $scope.interface.defineHTTPSuccess([/2.{2}/]);
            $scope.interface.useArray(false);
        });

        // Listen for when the files have been successfully uploaded.
        $scope.$on('$dropletSuccess', function onDropletSuccess(event, response, files) {
            $scope.uploadCount = files.length;
            $scope.success     = true;
            $scope.filenames  = response.names;
	
            $timeout(function timeout() {
                $scope.success = false;
              //  $scope.filenames=null;
            }, 2000);

        });

        // Listen for when the files have failed to upload.
        $scope.$on('$dropletError', function onDropletError(event, response) {
            $scope.error = true;
            console.log(response);

            $timeout(function timeout() {
                $scope.error = false;
              //  $scope.filenames=null;
            }, 2000);

        });
}]);



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

angular.module('controllers.dashboard')  
.directive('projectCard', function () {
	return {
				restrict: 'E',
				replace:true,
				scope: {
				    mgrImage: '@',
					prjName: '@',
					items1: '=',
					items2: '='
				},
				templateUrl:'templates/prj-card.html'
	}
})
.directive('cardList', function () {
	return {
				restrict: 'E',
				replace:true,
				scope: {
					placement:"@",
					listTemplate:"@",
					items: '='
				},
				templateUrl:'templates/card-btn.html',
				controller: function ($scope) {
					//console.log($scope.placement,$scope.items)
				}
				 
	}
})
.run(["$templateCache", function($templateCache) {
	$templateCache.put("templates/card-btn.html",
	 '<button popover-placement="{{placement}}"' 
	 +'       popover-trigger="mouseenter" '
	 +'       popover-animation="true"'
     +'       popover-template="listTemplate" '
     +'       class="btn btn-default">{{items.length}}</button>'
	);
  $templateCache.put("templates/prj-card.html",
     "<div class='well'>"
   +"  <div class='row'>"	
   +" 		<div class='col-md-3'>"	
   +"       <img ng-src='img/{{mgrImage}}'  class='img-circle'>"
   +"     </div>"
   +" 		<div class='col-md-9' style='text-align: center;'>"
   +" 		<a ui-sref='projects.list'>{{prjName}}</a><br>"
   +"       OK:<card-list placement='bottom' list-template='templates/card-list.html' items='items1'> </card-list>"
   +"       TODO:<card-list placement='bottom' list-template='templates/card-list.html' items='items2'> </card-list>"
   +" 		</div>"
   +"  </div>"
   +"</div>");
}]);

angular.module('controllers.issues', 
['ui.router'
, 'services.i18nNotifications'
, 'resources.users'
, 'resources.issues'
])  

.controller('IssuesMainCtrl',   [
               'crudContrllersHelp','$rootScope','$scope','$state',   '$stateParams',  'Project','User',
	function ( crudContrllersHelp,$rootScope,$scope,   $state,   $stateParams,   Project,User) {
	   crudContrllersHelp.initMain('Issue','name',$scope,   $state,   $stateParams)
       if(!$rootScope.exchangeData){
		   //User.query({isActive:true,isAdmin:false},{strict:true}).then(function(ds){
			 $scope.users =[]
		  //})
	   }else{
		   Project.getById($rootScope.exchangeData.projectId).then(function(prj){
			  // console.log(prj)
			  // var members=[ ]
			 //  for(var i=0;i<prj.teamMembers.length;i++)
			 //     members.push(''+prj.teamMembers[i])
			  
		      // console.log(members)   
			   User.getByObjectIds(prj.teamMembers).then(function(ds){
				    $scope.users=ds
				  //   console.log(ds)   
				})
		   })
		}   
	   $scope.checkDate= function(item){
			var now = new Date()
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
                '$rootScope','$scope', 'Issue','$stateParams',
	function ( $rootScope, $scope,   Issue ,$stateParams) {
		$scope.item = new Issue()
		$scope.isNew=true
		$scope.checkDate($scope.item)
		if(!!$rootScope.exchangeData){
		   $scope.item.targetType=$rootScope.exchangeData.targetType
		   $scope.item.target=$rootScope.exchangeData.target
		   $scope.item.projectId=$rootScope.exchangeData.projectId
	       $scope.item.backlogId=$rootScope.exchangeData.backlogId
		   $scope.item.state='TODO'
		   $rootScope.exchangeData=null
		}  
	}
])

.controller('IssuesEditCtrl',   [
                '$scope', '$stateParams', '$state', 'Project','User',
	function (  $scope,   $stateParams,   $state,Project,User) {
		$scope.isNew=false
		$scope.item = $scope.findById( $stateParams.itemId)
		$scope.checkDate($scope.item)
		if(!$scope.item.projectId) return
		Project.getById($scope.item.projectId).then(function(prj){
		      User.getByObjectIds(prj.teamMembers).then(function(ds){
				    $scope.users=ds
			  })
		   })
	}
])

angular.module('controllers.messages', ['ui.router','ngMessages'
, 'services.i18nNotifications'
, 'directives.dropdownMultiselect'
, 'resources.messages'])  
.controller('MessagesMainCtrl',   [
                'crudContrllersHelp','$scope', '$state', '$stateParams','Message',
	function ( crudContrllersHelp,  $scope,    $state,    $stateParams,  Message) {

		crudContrllersHelp.initMain('Message','title',$scope,   $state,   $stateParams)
		
		$scope.availableTags=["娱乐","科技"]
			
		$scope.checkDate= function(item){
			var now = new Date(Date.now())
			if(!item.recDate)
				item.recDate=now
			if(!item.closeDate)
				item.closeDate= now.setDate(now.getDate()+14)
		}

	}
])
.controller('MessagesListCtrl',   [
                'crudContrllersHelp','$scope', '$state', '$stateParams', 
	function (  crudContrllersHelp,$scope,   $state,   $stateParams) {
		crudContrllersHelp.initList('Message','title',$scope,   $state,   $stateParams)
	}
])
.controller('MessagesDetailCtrl',   [
                'crudContrllersHelp','$scope','$stateParams', '$state',
	function ( crudContrllersHelp, $scope,$stateParams,   $state) {
		crudContrllersHelp.initDetail('Message','title',$scope,   $state,   $stateParams)
	}
])

.controller('MessagesCreateCtrl',   [
                '$scope', 'Message',
	function (  $scope,   Message) {
		$scope.item = new Message()
		$scope.checkDate($scope.item)
	}
])

.controller('MessagesEditCtrl',   [
                '$scope', '$stateParams', '$state',
	function (  $scope,   $stateParams,   $state) {
		$scope.item = $scope.findById( $stateParams.itemId)
		$scope.item.tags=$scope.item.tags||[]
		$scope.checkDate($scope.item)
	}
])

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

angular.module('resources.backlogs', ['mongoResourceHttp'])

.factory('Backlog', ['$mongoResourceHttp', function ($mongoResourceHttp) {
  var res = $mongoResourceHttp('backlogs');

  res.forProject = function (projectId) {
      return res.query({projectId:projectId},{strict:true});
  }

  return res
}])

angular.module('resources.issues', ['mongoResourceHttp'])

angular.module('resources.issues').factory('Issue', ['$mongoResourceHttp', function ($mongoResourceHttp) {

  var res = $mongoResourceHttp('issues');


  return res;
}]);

angular.module('resources.messages', ['mongoResourceHttp'])

.factory('Message', ['$mongoResourceHttp', function ($mongoResourceHttp) {

  var resource = $mongoResourceHttp('messages');
  /*resource.prototype.getFullName = function () {
    return this.lastName + " " + this.firstName + " (" + this.email + ")";
  };*/

  return resource;
}]);

angular.module('resources.projects', ['mongoResourceHttp']);
angular.module('resources.projects').factory('Project', ['$mongoResourceHttp', function ($mongoResourceHttp) {

  var Project = $mongoResourceHttp('projects');

  Project.forProductMgr = function(userId) {
    //return Project.query({}, successcb, errorcb);
	return Project.query({productOwner:userId},{strict:true});
  };

  Project.prototype.isProductOwner = function (userId) {
    return this.productOwner === userId;
  };
  Project.prototype.canActAsProductOwner = function (userId) {
    return !this.isScrumMaster(userId) && !this.isDevTeamMember(userId);
  };
  Project.prototype.isScrumMaster = function (userId) {
    return this.processMaster === userId;
  };
  Project.prototype.canActAsScrumMaster = function (userId) {
    return !this.isProductOwner(userId);
  };
  Project.prototype.isDevTeamMember = function (userId) {
    return this.teamMembers.indexOf(userId) >= 0;
  };
  Project.prototype.canActAsDevTeamMember = function (userId) {
    return !this.isProductOwner(userId);
  };

  Project.prototype.getRoles = function (userId) {
    var roles = [];
    if (this.isProductOwner(userId)) {
      roles.push('PO');
    } else {
      if (this.isScrumMaster(userId)){
        roles.push('SM');
      }
      if (this.isDevTeamMember(userId)){
        roles.push('DEV');
      }
    }
    return roles;
  };

  return Project;
}]);

angular.module('resources.sprints', ['mongoResourceHttp']);
angular.module('resources.sprints').factory('Sprint', ['$mongoResourceHttp', function ($mongoResourceHttp) {

  var Sprint = $mongoResourceHttp('sprints');
  Sprint.forProject = function (projectId) {
    return Sprint.query({projectId:projectId});
  };
  return Sprint;
}]);

angular.module('resources.tasks', ['mongoResourceHttp']);
angular.module('resources.tasks').factory('Task', ['$mongoResourceHttp', function ($mongoResourceHttp) {

  var Task = $mongoResourceHttp('tasks');

  Task.statesEnum = ['TODO', 'IN_DEV', 'BLOCKED', 'IN_TEST', 'DONE'];

  Task.forProductBacklogItem = function (productBacklogItem) {
    return Task.query({productBacklogItem:productBacklogItem});
  };

  Task.forSprint = function (sprintId) {
    return Task.query({sprintId:sprintId});
  };

  Task.forUser = function (userId) {
    return Task.query({userId:userId});
  };

  Task.forProject = function (projectId) {
    return Task.query({projectId:projectId});
  };

  return Task;
}]);

angular.module('resources.users', ['mongoResourceHttp']);
angular.module('resources.users').factory('User', ['$mongoResourceHttp', function ($mongoResourceHttp) {

  var userResource = $mongoResourceHttp('users');
  /*userResource.prototype.getFullName = function () {
    return this.lastName + " " + this.firstName + " (" + this.email + ")";
  };*/

  return userResource;
}]);

angular.module('controllers.projects', ['ui.router','ngMessages'
, 'services.i18nNotifications'
, 'resources.projects'
, 'resources.users'
])  
.controller('ProjectsMainCtrl',   [
               'crudContrllersHelp','$scope', '$state', '$stateParams', '$http','Project','SERVER_CFG',
	function ( crudContrllersHelp,$scope,   $state,   $stateParams,    $http, Project,SERVER_CFG) {
 		/*User.query({isActive:true,isAdmin:false},{strict:true}).then(function(ds){
			$scope.users =ds
		})*/
			var baseURL= SERVER_CFG.URL+'/api/'
		  	$http.post(baseURL+'users/load',{})//只加载主要资料
		  	.then(function(resp){
				  var data=resp.data
				  console.log('users/load--',data)
				  $scope.users =data
          })
		crudContrllersHelp.initMain('Project','name',$scope,   $state,   $stateParams)     
	}
])
.controller('ProjectsListCtrl',   [
                'security','crudContrllersHelp','$rootScope','$scope', '$state', '$stateParams', 'i18nNotifications', 
	function ( security,crudContrllersHelp,$rootScope, $scope,   $state,   $stateParams,    i18nNotifications) {
		crudContrllersHelp.initList('Project','name',$scope,   $state,   $stateParams)
		$scope.backlogs=function (item) {
			$state.go('backlogs-list', {projectId: item.$id()})
		}
		$scope.issues=function (item) {
			$rootScope.exchangeData={targetType:'项目',target: item.name
				                            ,projectId:item.$id(),backlogId:null}
			$state.go('issues.create')
		}
		$scope.isProductMgr=function(item) {
		    if(!security.currentUser) return false;
		    var mgrId=security.currentUser.id;
			//console.log(mgrId,item.productOwner)
			return item.productOwner==mgrId
		}
		$scope.isDevMgr=function(item) {
		    if(!security.currentUser) return false;
		    var mgrId=security.currentUser.id;
			//console.log(mgrId,item.procMaster)
			return item.procMaster==mgrId
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

angular.module('controllers.users', ['ui.router','ngMessages'
, 'services.i18nNotifications'
, 'directives.dropdownMultiselect'
, 'resources.users'])  
.controller('UsersMainCtrl',   [
               'crudContrllersHelp','$scope', '$state', '$stateParams', 
	function ( crudContrllersHelp,$scope,   $state,   $stateParams) {
		
		crudContrllersHelp.initMain('User','name',$scope,   $state,   $stateParams)
		$scope.availableSkills=['协调','后端编码','前端编码','2D做图','3D建模','文档写作','测试']

		$scope.checkDate= function(item){
			var now = new Date(Date.now())
			if(!item.regDate)
				item.regDate=now
		}

	}
])
.controller('UsersListCtrl',   [
                'crudContrllersHelp','$scope', '$state', '$stateParams',
	function ( crudContrllersHelp, $scope,   $state,   $stateParams) {
		crudContrllersHelp.initList('User','name',$scope,   $state,   $stateParams)
	}
	
])
.controller('UsersDetailCtrl',   [
               'crudContrllersHelp', '$scope','$stateParams', '$state',
	function ( crudContrllersHelp,$scope,  $stateParams,    $state) {
		crudContrllersHelp.initDetail('User','name',$scope,   $state,   $stateParams)
		
	}
])
.controller('UsersCreateCtrl',   [
                '$scope', 'User',
	function (  $scope,   User) {
		$scope.item = new User()
		$scope.item.isActive=true
		$scope.item.isAdmin=false
		$scope.isNew=true
		$scope.checkDate($scope.item)
		$scope.item.desc=
"expressjs/multer [![NPM version](https://badge.fury.io/js/multer.svg)](https://badge.fury.io/js/multer)\r\n"
+"\r\n"
+"Multer is a node.js middleware for handling `multipart/form-data`.\r\n"
+"\r\n"
+"It is written on top of [busboy](https://github.com/mscdex/busboy) for maximum efficiency.\r\n"
+"\r\n"
+"## API\r\n"
+"\r\n"
+"#### Installation\r\n"
+"\r\n"
+"`$ npm install multer`\r\n"
+"\r\n"
+"#### Usage\r\n"
+"\r\n"
+"```js\r\n"
+"var express = require('express')\r\n"
+"var multer  = require('multer')\r\n"
+"\r\n"
+"var app = express()\r\n"
+"app.use(multer({ dest: './uploads/'}))\r\n"
+"```\r\n"
+"\r\n"
+"\r\n"
+"**IMPORTANT**: Multer will not process any form which is not `multipart/form-data`."
	}
])

.controller('UsersEditCtrl',   [
                '$scope', '$stateParams', '$state',
	function (  $scope,   $stateParams,   $state) {
		$scope.item = $scope.findById( $stateParams.itemId)
		$scope.checkDate($scope.item)
		$scope.isNew=false
	
	}
])

angular.module('controllers.users')  
.directive('validateEquals', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      function validateEqual(myValue, otherValue) {
        if (myValue === otherValue) {
          ctrl.$setValidity('equal', true)
          return myValue
        } else {
          ctrl.$setValidity('equal', false)
          return undefined
        }
      }

      scope.$watch(attrs.validateEquals, function(otherModelValue) {
        ctrl.$setValidity('equal', ctrl.$viewValue === otherModelValue)
      })

      ctrl.$parsers.push(function(viewValue) {
        return validateEqual(viewValue, scope.$eval(attrs.validateEquals))
      })

      ctrl.$formatters.push(function(modelValue) {
        return validateEqual(modelValue, scope.$eval(attrs.validateEquals))
      })
    }
  }
})
.directive('uniqueMobileNo', [
            "$http","SERVER_CFG",
 function ($http,SERVER_CFG) {
  return {
    require:'ngModel',
    restrict:'A',
    link:function (scope, el, attrs, ctrl) {
     //using push() here to run it as the last parser, after we are sure that other validators were run
      ctrl.$parsers.push(function (viewValue) {
        if (viewValue) {
		  	var baseURL= SERVER_CFG.URL+'/api/'
		  	$http.post(baseURL+'users/uniqueMobileNo',{mobileNo:viewValue})
		  	.then(function(resp){
				  var uniqueMobileNo=resp.data.uniqueMobileNo
				 //console.log('users/uniqueMobileNo--',uniqueMobileNo)
				 ctrl.$setValidity('uniqueMobileNo', uniqueMobileNo )
          })
          return viewValue
        }
      })
    }
  }
}])

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
