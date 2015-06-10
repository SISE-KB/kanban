angular.module('app', [ 'ngAnimate','ngMessages', 'ui.router','ngDroplet'
,'ngSanitize',  'ui.select'
 ,'hc.marked', 'ui.bootstrap','ng-sortable'
,'services.i18nNotifications', 'services.httpRequestTracker','services.stateBuilderProvider'
,'directives.crud', 'security','filters'
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
        template: '<div><h1>个人工作看板，正在开发......</h1><span>产品代表：{{myPrdMgrPrjs}};参与开发：{{myDevPrjs}}</span><div>'
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
.run([           '$rootScope', '$state', '$stateParams','$log','security','globalData',
    function ($rootScope,     $state,     $stateParams,    $log,    security,    globalData) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
      $rootScope.isAuthenticated = security.isAuthenticated;
      $rootScope.isAdmin = security.isAdmin;
      $rootScope.$on('user:authenticated', function(event,user){
		  $log.info('user:authenticated',user);
		  globalData.setCurrentUser(user);
	 });	  
   }
])
.controller('HomeCtrl', [
            '$scope','globalData',
  function ( $scope,  globalData) {
	  $scope.myDevPrjs=globalData.devPrjs;
      $scope.myPrdMgrPrjs=globalData.mgrPrjs;
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
		//console.log(toState.name,toParams)
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
	     $scope.$state.go('mytasks')
	 }
	  else{
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

angular.module('app').factory('globalData', [
  	              '$http', '$q','$log','SERVER_CFG', 
    function ($http,   $q,    $log,    SERVER_CFG) {
		
        var apiUrl = SERVER_CFG.URL+'/api/';
        var gData={};
        gData.mgrPrjs=[];
        gData.devPrjs=[];
         	
       	
          gData.sendApiRequest=function(req,args){
			   args=!args?{}:args;
			   $log.debug(req,args);
			   return $http.post(apiUrl+req ,args )
		  	                   .then(function(resp){
				                     var data=resp.data;
	 			                     $log.debug('return data:',data);
				                     return data;
				               });     
       	  } ;
       	  
       	 gData.toResourcesArray = function (Res,data) {
			   var rt=[];
			   if(data&&data.length>0){
				   for(var i=0;i<data.length;i++)
					   rt.push(new Res(data[i]));
				}	   
               return rt;
         };
        gData.setCurrentUser=function(user){
		     gData.currentUser=user;
		     if(!user) {
				     gData.mgrPrjs=[];
                     gData.devPrjs=[];
			 }else{
				  var userId=user.id;
		          var req= apiUrl+'projects/mgrby';
		          $log.debug("post :",req);
		         $http.post(req,{userId:userId}).then(function(response) {
		               $log.info("/api/projects/mgrby",response.data);
                       gData.mgrPrjs=response.data;
                  });
                 req= apiUrl+'projects/devby';
                 $log.debug("post :",req);
                  $http.post(req,{userId:userId}).then(function(response) {
		               $log.info("/api/projects/devby",response.data);
                       gData.devPrjs=response.data;
                  });
             }     
		};
        return gData;
     }
  ]);

angular.module('controllers',[
 'controllers.messages'
,'controllers.users'
,'controllers.projects'
,'controllers.backlogs'
,'controllers.sprints'
,'controllers.issues'
,'controllers.dashboard'
,'controllers.mytasks'
])
angular.module('resources', [
 'resources.messages'
,'resources.users'
,'resources.projects'
,'resources.backlogs'
,'resources.issues'
,'resources.tasks'
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
               'crudContrllersHelp','$scope','$state',   '$stateParams',  '$log','Project','User','globalData',
	function ( crudContrllersHelp,$scope,   $state,   $stateParams,  $log, Project,User,globalData) {
	   crudContrllersHelp.initMain('Issue','name',$scope,   $state,   $stateParams)
       if(!globalData.exchangeData){
				 $scope.users =[];
	   }else{
		   Project.getById(globalData.exchangeData.projectId).then(function(prj){
			     $log.debug('IssuesMainCtrl look for prj',prj);
				  User.getByObjectIds(prj.teamMembers).then(function(ds){
					    $scope.users= ds;
					    $log.debug('IssuesMainCtrl the prj members:',ds);
				  });
		   });
		}   
	   $scope.checkDate= function(item){
			var now = new Date();
			if(!item.regDate)
				item.regDate=now;
			if(!item.closeDate)
				item.closeDate= now.setDate(now.getDate()+14);
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
                    '$scope', '$stateParams','Issue','globalData',
	function ( $scope,   $stateParams,    Issue ,globalData) {
		$scope.item = new Issue();
		$scope.isNew=true;
		$scope.checkDate($scope.item);
		if(!!globalData.exchangeData){
		   $scope.item.targetType=globalData.exchangeData.targetType;
		   $scope.item.target=globalData.exchangeData.target;
		   $scope.item.projectId=globalData.exchangeData.projectId;
	       $scope.item.backlogId=globalData.exchangeData.backlogId;
		   $scope.item.state='TODO';
		   globalData.exchangeData=null;
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

angular.module('controllers.mytasks', ['ui.router','ui.calendar','resources.tasks'])

.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('mytasks', {
    templateUrl:'views/mydashboard/list.tpl.html',
    controller:'MyDashboardCtrl',
  })
}])

.controller('MyDashboardCtrl', 
        ['$http','$scope','Task','globalData',
function ($http,  $scope,  Task , globalData) {
        $scope.images = [{'thumb': 'img/1.jpg'},{'thumb': 'img/2.jpg'},{'thumb': 'img/3.jpg'},{'thumb': 'img/4.jpg'}];
        $scope.list1 = [];
        angular.forEach($scope.images, function(val, key) {
          $scope.list1.push({});
        });
        $scope.list2 = [
          { 'title': 'Item 1', 'drag': true },
          { 'title': 'Item 2', 'drag': true },
          { 'title': 'Item 3', 'drag': true },
          { 'title': 'Item 4', 'drag': true }
        ];

        $scope.startCallback = function(event, ui, title) {
          console.log('You started draggin: ' + title.title);
          $scope.draggedTitle = title.title;
        };

        $scope.stopCallback = function(event, ui) {
          console.log('Why did you stop draggin me?');
        };

        $scope.dragCallback = function(event, ui) {
          console.log('hey, look I`m flying');
        };

        $scope.dropCallback = function(event, ui) {
          console.log('hey, you dumped me :-(' , $scope.draggedTitle);
        };

        $scope.overCallback = function(event, ui) {
          console.log('Look, I`m over you');
        };

        $scope.outCallback = function(event, ui) {
          console.log('I`m not, hehe');
        };

      
      
    $scope.projects = globalData.devPrjs;
	Task.forUser(globalData.currentUser._id).then(function(ds){
			$scope.tasks = ds;
		    //$log.debug('load my tasks',ds);
	});

	$scope.uiConfig = {
      calendar:{
        height: 700,
        editable: true,
        header:{
          left: 'prev today next',
          center: 'title',
          right: 'month agendaWeek agendaDay'
        },
		 buttonText: { //This is to add icons to the visible buttons
                prev: "前一个",
                next: "后一个",
                today: '今日',
                month: '月',
                week: '周',
                day: '天'
            },
			editable: true,
            droppable: true, // this allows things to be dropped onto the calendar !!!
            drop: function(date, allDay) {
			  console.log(date,allDay);
			},
			eventLimit: true // allow "more" link when too many events
			
        //dayClick: $scope.alertEventOnClick,
        //eventDrop: $scope.alertOnDrop,
        //eventResize: $scope.alertOnResize
      }
    };
	 var date = new Date();
     var d = date.getDate(),
            m = date.getMonth(),
            y = date.getFullYear();
	$scope.uiConfig.calendar.events= [
			{
                title: 'All Day Event',
                start: new Date(y, m, 1),
                backgroundColor: "#f56954", //red
                borderColor: "#f56954" //red
            }, {
                title: 'Long Event',
                start: new Date(y, m, d - 5),
                end: new Date(y, m, d - 2),
                backgroundColor: "#f39c12", //yellow
                borderColor: "#f39c12" //yellow
            }, {
                title: 'Meeting',
                start: new Date(y, m, d, 10, 30),
                allDay: false,
                backgroundColor: "#0073b7", //Blue
                borderColor: "#0073b7" //Blue
            },
			{
					id: 999,
					title: 'Repeating Event',
					start: '2015-06-08T10:00:00'
			},
			{
					id: 999,
					title: 'Repeating Event',
					start: '2015-06-15T10:00:00'
			}];
	
}])

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

angular.module('resources.backlogs', ['mongoResourceHttp'])
.factory('Backlog', ['$mongoResourceHttp', function ($mongoResourceHttp) {
  var res = $mongoResourceHttp('backlogs');

  res.forProject = function (projectId,state) {
	  var q={projectId:projectId};
	  if(!!state) q.state=state;
      return res.query(q,{strict:true});
  };
  res.forSprint= function (sprintId,state) {
	  var q={sprintId:sprintId};
	  if(!!state) q.state=state;
      return res.query(q,{strict:true});
  }
  
  return res;
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

angular.module('resources.sprints', ['mongoResourceHttp'])
.factory('Sprint', ['$mongoResourceHttp', function ($mongoResourceHttp) {
  var res = $mongoResourceHttp('sprints');
  res.forProject = function (projectId,state) {
	  var q={projectId:projectId};
	  if(!!state) q.state=state;
      return res.query(q,{strict:true});
  }
  
  return res;
}]);

angular.module('resources.tasks', ['mongoResourceHttp']);
angular.module('resources.tasks').factory('Task', ['$mongoResourceHttp', function ($mongoResourceHttp) {

  var res = $mongoResourceHttp('tasks');

  //res.statesEnum = ['TODO', 'DOING', 'BLOCKED', 'TEST', 'DONE', 'OK'];

  res.forSprint= function (sprintId,state) {
	  var q={sprintId:sprintId};
	  if(!!state) q.state=state;
      return res.query(q,{strict:true});
  }
  res.forProject = function (projectId) {
    return res.query({projectId:projectId},{strict:true});
  };
  
  res.forUser = function (userId) {
    return res.query({assignedUserId:userId},{strict:true});
  };

  return res;
}]);

angular.module('resources.users', ['mongoResourceHttp']);
angular.module('resources.users').factory('User', ['$mongoResourceHttp', function ($mongoResourceHttp) {

  var res = $mongoResourceHttp('users');
  /*userResource.prototype.getFullName = function () {
    return this.lastName + " " + this.firstName + " (" + this.email + ")";
  };*/

  return res;
}]);

angular.module('controllers.users', ['ui.router','ngMessages'
, 'services.i18nNotifications'
, 'directives.dropdownSelect'
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
		$scope.item = new User();
		$scope.item.isActive=true;
		$scope.item.isAdmin=false;
		$scope.isNew=true;
		$scope.checkDate($scope.item);
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
+"**IMPORTANT**: Multer will not process any form which is not `multipart/form-data`.";
	}
])

.controller('UsersEditCtrl',   [
                '$scope', '$http','SERVER_CFG', 
	function (  $scope,$http,SERVER_CFG ) {
		$scope.item = $scope.findById( $scope.$stateParams.itemId);
		$scope.checkDate($scope.item);
		var url = SERVER_CFG.URL+'/images/'+$scope.item.mobileNo;
		$scope.isNew=false
		$http.get(url).then(function(reps){
		   $scope.imgs=reps.data;
		   //console.log($scope.imgs);
		});
	
	}
]);

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
	$stateProvider
		.state('backlogs', {
				url: "/backlogs/:projectId",
				templateUrl: 'views/projects/backlogs/index.tpl.html',
				controller: 'BacklogsListCtrl'
		})
		/*.state('backlogs-edit', {
				url: '/backlogs/:backlogId/:projectId',
				templateUrl: 'views/projects/backlogs/edit.tpl.html',
				controller:  'BacklogsEditCtrl'
		})*/
 }])

 .controller('BacklogsListCtrl', [
              '$scope', '$log','$modal','Backlog','globalData',
    function($scope,     $log, $modal , Backlog,  globalData){
		var projectId = $scope.$stateParams.projectId;
		//$scope.projectId=projectId;
        globalData.sendApiRequest("backlogs/stats",{projectId:projectId})
       .then(function(data){
		     $log.debug(data);
		     $scope.todoItems = globalData.toResourcesArray(Backlog,data.TODO ); 
		     $scope.doingItems = globalData.toResourcesArray(Backlog,data.DOING );
		     $scope.doneItems = globalData.toResourcesArray(Backlog,data.DONE);
		     $scope.okItems =globalData.toResourcesArray(Backlog,data.OK);
		 });
	 	
	 	$scope.myPrjs=globalData.mgrPrjs;
	    var dialog=null;
	    
	    function onDialogClose(success) {
			   $log.debug('onDialogClose',success);
			    dialog = null;
			    if(success&&$scope.item) {
			        $log.debug('UPDTATE:',$scope.item);
			        $scope.item.$update();
		         }
		        return success;
	    }


  
	    $scope.edit = function (item) {
			 $scope.item=item;
			 $log.debug('edit:',$scope.item);
			
			//$scope.$state.go('backlogs-edit',  {backlogId:item._id,projectId:projectId})
			 dialog = $modal.open({ templateUrl:'views/projects/backlogs/edit.tpl.html'
					                    , controller: 'BacklogsEditCtrl'});
             dialog.result.then(onDialogClose);
              globalData.exchange=[dialog,item];
		};


		$scope.addBacklog = function () {
			  $scope.item = new Backlog();
			  $scope.item.state="TODO";
              $scope.item.projectId=projectId;
              $scope.item.name=$scope.newText;
              $scope.item.desc=
"# 一级标题\r\n"
+"\r\n"
+"## 二级标题\r\n"
+"\r\n"
+"`红色提醒`\r\n"
+"\r\n"
+"**Code**:\r\n"
+"\r\n"
+"```js\r\n"
+"var express = require('express')\r\n"
+"var multer  = require('multer')\r\n"
+"\r\n"
+"var app = express()\r\n"
+"app.use(multer({ dest: './uploads/'}))\r\n"
+"```\r\n"
+"\r\n"
+"[详细参考](http://www.ituring.com.cn/article/775)."
                    
              $scope.item.$save();
              $scope.todoItems.push($scope.item);
		}
			
		$scope.updateState = function (item) {
			globalData.sendApiRequest("backlogs/update",{id:item._id,state:item.state});
		};
	
		var makeConfig =function(state) {
			return {
				animation: 150,
				group: {name : state,put: ['TODO','DOING','DONE','OK']},
				onAdd: function(item){
					$log.debug("onAdd--",item.model.name);
					item.model.state=state;
					$scope.updateState(item.model);
				}	
			};
        };
        $scope.todoConfig=makeConfig('TODO');
        $scope.doingConfig=makeConfig('DOING');
        $scope.doneConfig=makeConfig('DONE');  
        $scope.okConfig=makeConfig('OK');
  }])

  .controller('BacklogsEditCtrl', [
             '$scope', 'globalData',
    function($scope, globalData){
       
       var dialog=globalData.exchange[0];
       $scope.item=globalData.exchange[1];
       globalData.exchange=null;
       $scope.save=function() {
			dialog.close(true);
	    }	
	
		$scope.cancel= function() {
           dialog.close(false);
        };
   /*   
	    $scope.onSave = function (item) {
			i18nNotifications.pushForNextRoute('crud.save.success', 'success', {id : item['name']});
			$scope.$state.go('backlogs-list', $scope.$stateParams) 
		};
	    $scope.onError = function() {
			i18nNotifications.pushForCurrentRoute('crud.save.error', 'danger')
		}
		$scope.onRemove = function(item) {
			i18nNotifications.pushForCurrentRoute('crud.remove.success', 'success', {id : item['name']});
			$scope.$state.go('backlogs-list', $scope.$stateParams) 
		};
		$scope.remove = function(item, $index, $event) {
			$event.stopPropagation()
			item.$remove().then(function() {
				$scope.onRemove(item)
			}, function() {
				i18nNotifications.pushForCurrentRoute('crud.user.remove.error', 'danger',  {id : item['name']});
			});
		};*/
	   
  }])

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
		    item.$save();
		    $scope.tasks.push(item);
		    $log.debug('save Task:',item);
		    
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
		$scope.task=globalData.exchange;
		 Project.getById($scope.$stateParams.projectId).then(function(prj){
			    User.getByObjectIds(prj.teamMembers).then(function(users){
					   // $scope.users= ds;
					    $log.debug('load  prj members:',users);
					    $scope.users= users;
				  });
		  });	
		
		$scope.save = function () {
	       $scope.task.$update();
	       var args=$scope.$stateParams;
	       args.sprintId=$scope.task._id;
	       $scope.$state.go('sprints.tasks', args);
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
