angular.module('app', [ 'ngAnimate','ngMessages', 'ui.router','ngDroplet','ngDragDrop'
,'ngSanitize',  'ui.select'
 ,'hc.marked', 'ui.bootstrap','ng-sortable'
,'services.i18nNotifications', 'services.httpRequestTracker','services.stateBuilderProvider'
,'directives.crud', 'security','filters'
,'resources','controllers'
])
.config(['$stateProvider','$urlRouterProvider', 'securityAuthorizationProvider',
function ($stateProvider,$urlRouterProvider,securityAuthorizationProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('dashboard',  {
	      url: '/'
	    ,templateUrl: 'views/dashboard/index.tpl.html'
	     ,resolve: {
			  projectsStatData: ['globalData',
			            function( globalData){
							return globalData.sendApiRequest('projects/stats');
			           }]
		   } 
	 , controller: 'DashboardCtrl'
         
    }) 
    .state('upload',  {
	    url: '/upload'
	   ,resolve: {
	       currentUser: securityAuthorizationProvider.requireAuthenticatedUser// null if not login
	    }
      ,templateUrl: 'views/upload.tpl.html'
     , controller: 'UploadCtrl'
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
		  $rootScope.currentUser=user;
	 });	  
   }
])

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
 var initMain = function (ResName,searchField,notifyField,$scope) {
       var   $state=$scope.$state,  
   	         $stateParams=$scope.$stateParams;
		var Res = $injector.get(ResName);
		var i18nNotifications = $injector.get('i18nNotifications');

		var ressName=Res.getName()

		$scope._data = [];//load from server
		$scope.users=[];

		$scope.query = '';
		$scope.visited=[];

		$scope.search=function() {
			var q={};
			q[searchField]=$scope.query;
			Res.query(q).then(function(ds){
				$scope._data=ds;
				$scope.visited=[];
				$state.go(ressName+'.list') ;
		  })
	    }
		$scope.findById = function (id) {
			if(!$scope._data){
				var rt= Res.getById(id);
			    return rt;
			}
			for (var i = 0; i < $scope._data.length; i++) {
				var rt=$scope._data[i];
				if ($scope._data[i].$id() == id)
					return rt;
			}
			return null;
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
			$scope.visited.push(item);
			while ($scope.visited.length>10)
				$scope.visited.shift();
		}
		$scope.onSave = function (item) {
			i18nNotifications.pushForNextRoute('crud.save.success', 'success', {id : item[notifyField]});
			//console.log($state.current.name)
			var idx=$state.current.name.indexOf('create');
			//console.log(idx)
			if(idx > -1){
				$scope._data.push(item);
			}
			$state.go(ressName+'.list', $stateParams) ;
		}
		$scope.onError = function() {
			i18nNotifications.pushForCurrentRoute('crud.save.error', 'danger');
		}
		$scope.onRemove = function(item) {
			i18nNotifications.pushForCurrentRoute('crud.remove.success', 'success', {id : item[notifyField]});
			$scope.removeFromArray($scope._data,item);
			$scope.removeFromArray($scope.visited,item);
			$state.go(ressName+'.list', $stateParams) ;
		}
	
  }
var initList = function (ResName,searchField,notifyField,$scope) {
       var   $state=$scope.$state,  
   	         $stateParams=$scope.$stateParams;
			 
		var i18nNotifications = $injector.get('i18nNotifications');
		var Res = $injector.get(ResName);

  		$scope.data = [];// display items
		$scope.numPerPage=10;
		$scope.currentPage = 1;
		$scope.totalItems=0;
		
		$scope.setPage = function (pageNo) {
			$scope.currentPage = pageNo;
		}
       
		$scope.maxSize = 5;


		$scope.$watch("currentPage + numPerPage + _data", function() {
			$scope.totalItems = $scope._data.length;
			var begin = (($scope.currentPage - 1) * $scope.numPerPage)
				, end = begin + $scope.numPerPage;

			if(end>$scope._data.length) 
				   end=$scope._data.length;

			$scope.data = $scope._data.slice(begin, end);
		})
  
		$scope.remove = function(item, $index, $event) {
			// Don't let the click bubble up to the ng-click on the enclosing div, which will try to trigger
			// an edit of this item.
			$event.stopPropagation();
			item.$remove().then(function() {
				$scope.onRemove(item);
			}, function() {
				i18nNotifications.pushForCurrentRoute('crud.user.remove.error', 'danger', {id : item[notifyField]});
			})
		}
		var ressName=Res.getName(false,false)
		$scope.view = function (item) {
			$state.go(ressName+'.detail', {itemId: item.$id()});
		}
		$scope.edit = function (item) {
			$state.go(ressName+'.edit', {itemId: item.$id()});
		}
		$scope.create = function () {
			$state.go(ressName+'.create');
		}
		
}
var initDetail = function (ResName,searchField,notifyField,$scope) {
        var   $state=$scope.$state,  
   	         $stateParams=$scope.$stateParams;
		var i18nNotifications = $injector.get('i18nNotifications');
		var Res = $injector.get(ResName);
		$scope.item = $scope.findById( $stateParams.itemId);
		$scope.addToVisited($scope.item);
		var ressName=Res.getName(false,false);
		$scope.edit = function () {
			$state.go(ressName+'.edit', {itemId: $scope.item.$id()});
		}
		$scope.list = function () {
			$state.go(ressName+'.list');
		}
}
  return {
	  initMain:initMain
	,initDetail:initDetail
	,initList:initList  
  };
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

angular.module('app').factory('globalData',
       [     '$http', '$log','SERVER_CFG', 
    function ($http,   $log,  SERVER_CFG) {
		
        var apiUrl = SERVER_CFG.URL+'/api/';
        var gData={};
        gData.mgrPrjs=[];
        gData.devPrjs=[];
         	
       	gData.removeItemFromArray=function(arrs,item){
		   var fnd=-1;
		   for(var i=0;i<arrs.length;i++){
		      if(arrs[i]==item){
			     fnd=i;
				 break;
			  }
		   }
		   if(fnd>=0) arrs.splice(fnd,1);
		   
		};
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
		      $log.debug('setCurrentUser:',gData.currentUser);
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

angular.module('resources', [
 //'resources.messages'
,'resources.users'
,'resources.projects'
,'resources.backlogs'
,'resources.issues'
,'resources.tasks'
,'resources.myevents'
])

angular.module('controllers',[
 //'controllers.messages'
,'controllers.users'
,'controllers.projects'
,'controllers.backlogs'
,'controllers.sprints'
,'controllers.issues'
,'controllers.dashboard'
,'controllers.mytasks'
])
.config(['stateBuilderProvider', 
function (stateBuilderProvider) {
   stateBuilderProvider.statesFor('User') 
   stateBuilderProvider.statesFor('Project')   	
   stateBuilderProvider.statesFor('Issue') 	
  // stateBuilderProvider.statesFor('Message') 	
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
            $scope.interface.setRequestUrl('upload'+'/'+currentUser.code);
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



angular.module('controllers.dashboard', ['ui.router','ui.bootstrap','ngMessages',
, 'resources.projects'
, 'resources.backlogs'
, 'resources.users'
, 'resources.tasks'
, 'resources.issues'
])  
/*globalData.sendApiRequest('projects/stats').then(function(data){
				 $scope.projectsStatData=data;//2 calls!?
	   });  */

.controller('DashboardCtrl', [ 
                          '$scope','projectsStatData',
         function($scope,projectsStatData){
		   //console.log(projectsStatData.length);
		   $scope.projectsStatData=projectsStatData;
		   //$scope.myDevPrjs=globalData.devPrjs;
         // $scope.myPrdMgrPrjs=globalData.mgrPrjs;
	   }
])



angular.module('controllers.dashboard')  
.directive('projectCard', function () {
	return {
				restrict: 'E',
				replace:true,
				scope: {
				    mgrImage: '@',
					prjName: '@',
					id: '@_id',
					items1: '=',
					items2: '=',
					items3: '=',
					items4: '=',
					tasks: '=',
					issues: '='
				},
				templateUrl:'views/dashboard/prj-card.tpl.html'
				

	}
})
.directive('itemList', function () {
	return {
				restrict: 'E',
				replace:true,
				scope: {
					placement:"@",
					listTemplate:"@",
					pic: '@',
					items: '='
				},
				templateUrl:'views/dashboard/item-btn.tpl.html'
				 
	}
})
.directive('backlogList', function () {
	return {
				restrict: 'E',
				replace:true,
				scope: {
					listTemplate:"@",
					items1: '=',
					items2: '=',
					items3: '=',
					items4: '=',
				},
				templateUrl:'views/dashboard/backlog-btn.tpl.html',
				controller: function ($scope) {
					console.log($scope.items2);
					var makeConfig =function(state) {
			            return {
				          animation: 150,
				          group: {name : state}
				       };
                   };
		
				$scope.todoConfig=makeConfig('TODO');
				$scope.doingConfig=makeConfig('DOING');
				$scope.doneConfig=makeConfig('DONE');  
				$scope.okConfig=makeConfig('OK');
			}
				 
	}
})

angular.module('controllers.issues', 
['ui.router'
, 'services.i18nNotifications'
, 'resources.users'
, 'resources.issues'
])  

.controller('IssuesMainCtrl',   [
               'crudContrllersHelp','$scope',  '$log','Project','User','globalData',
	function ( crudContrllersHelp,  $scope,    $log,   Project,  User,   globalData) {
	   crudContrllersHelp.initMain('Issue','name','name',$scope);
	   $scope.curProjectName=null;
	  /* $scope.$watch('curProjectId', function(val) {
		   console.log(val);
           $scope.projectChanged( $scope.curProjectId);
       });*/
	   $scope.projectChanged=function (prjId){
		    if(!prjId) return ;
		   
	   }
       if(!globalData.exchangeData){
				 $scope.users =[];
				 globalData.sendApiRequest('projects/load').then(function(data){
				     $scope.projects=data;
				     if(data.length>0){
						  $scope.curProjectName=data[0].name;
					  }
				  });   
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
		crudContrllersHelp.initList('Issue','name','name',$scope);
	}
])
.controller('IssuesDetailCtrl',   [
                 'crudContrllersHelp','$scope','$stateParams', '$state',
	function ( crudContrllersHelp, $scope,$stateParams,   $state) {
		crudContrllersHelp.initDetail('Issue','name','name',$scope);
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

		crudContrllersHelp.initMain('Message','title','title',$scope);
		
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
		crudContrllersHelp.initList('Message','title','title',$scope);
	}
])
.controller('MessagesDetailCtrl',   [
                'crudContrllersHelp','$scope','$stateParams', '$state',
	function ( crudContrllersHelp, $scope,$stateParams,   $state) {
		crudContrllersHelp.initDetail('Message','title','title',$scope);
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

angular.module('controllers.mytasks', ['ui.router','ui.calendar','resources.tasks','resources.myevents'])
.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('userTasks',{
		   url: "/userTasks/:userId",
		   templateUrl:'views/mytasks/userTaskList.tpl.html',
           controller:'userTasksCtrl'
	});
   $stateProvider.state('mytasks', {
    templateUrl:'views/mytasks/list.tpl.html',
    controller:'MyDashboardCtrl'
  });
}])
.controller('userTasksCtrl', 
                        ['$scope','$stateParams','$log',
    function ( $scope,$stateParams,$log) {
	  $log.debug('$stateParams:',$scope.$stateParams);
	  $scope.userId=$stateParams.userId;
	  
	  $scope.tasks=[
	        {name:'T1',state:'TODO'}
		  ,{name:'T2',state:'OK'} 
	  ];
      
}])  
.controller('ModalInstanceCtrl', [
               '$scope', '$log','$modalInstance','globalData',
    function ($scope,    $log,  $modalInstance,   globalData) {
	$scope.item=globalData.exchange;
	$scope.save = function () {

		if($scope.item) {
			$log.debug('UPDTATE:',$scope.item);
			$scope.item.$update();
		}
		$modalInstance.close(true);
	};

	$scope.cancel = function () {
		$modalInstance.close(false);//dismiss('cancel');
	};
}])

.controller('MyDashboardCtrl', 
        ['$http','$q','$log','$scope','$timeout','$modal','Task','MyEvent','security','globalData',
function ($http,  $q, $log, $scope,$timeout,$modal,  Task , MyEvent, security,globalData) {
	var curUserId=security.currentUser.id;
    var dialog=null;
    
    $scope.mytasks=[];
    
    function onDialogClose(success) {
	//	$log.debug('onDialogClose',success);
		dialog = null;
		return success;
	}
    function onResize(event){
		event.$update();
	}

	function loadData(start,end,timezone, callback){
		MyEvent.load(curUserId).then(function(es){
			var rt=[];
			for( var i=0;i<es.length;i++){
				var e=es[i];
				var d=new Date(e.start)
				   ,d1=new Date(start._d)
				   ,d2=new Date(end._d);
				
				d=d.getTime();d1=d1.getTime();d2=d2.getTime();
				if(d>=d1&&d<=d2)
				   rt.push(e);
			}
			callback(rt);
		});
	}
	$scope.edit = function (item) {
		globalData.exchange=item;
		dialog = $modal.open({ templateUrl:'views/mytasks/edit.tpl.html'
					              , controller: 'ModalInstanceCtrl'});
		return  dialog.result.then(onDialogClose);
	};
		
	$scope.addMyEvent=function(){
		$scope.mytasks.push({title:$scope.newText});
	}

	Task.forUser(curUserId).then(function(ds){
			$scope.tasks = ds;
	});

	
	$('#calendar').fullCalendar({
		lang: 'zh-cn',
		businessHours:{
			start: '9:00', // a start time (10am in this example)
			end: '18:00', // an end time (6pm in this example)
            dow: [ 1, 2, 3, 4,5 ]
		},
		eventSources: [
			{events:loadData, color: 'black',textColor: 'yellow' }
		],
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
      
		editable: true,
        droppable: true, // this allows things to be dropped onto the calendar !!!
        eventLimit: true,
        eventResize: onResize,
        eventDrop: function(event, delta, revertFunc,jsEvent) {
	        event.$update();
        },
        eventClick: function(event, element) {
			$scope.edit(event).then(function(){
				 $('#calendar').fullCalendar('updateEvent', event);
			});
		},
        drop: function(date, allDay) { // this function is called when something is dropped
     //JSON.parse( 
            var eventObject =$(this).data('event') ;
     
            var cls=$(this).attr('class');
     $log.debug(eventObject);
           
          //  var copiedEventObject = $.extend({}, originalEventObject);
            eventObject.start = date;
            if(cls.indexOf("my")>=0){
				eventObject.color="black";
				eventObject.textColor="white";
			}else{
				eventObject.color="yellow";
				eventObject.textColor="red";
			 }
               eventObject.userId=curUserId;
              // console.log('curUserId',curUserId);
              var  obj=new MyEvent(eventObject);
              obj.$save(); 
              $('#calendar').fullCalendar('renderEvent', obj, false);
              $(this).remove();
	  }
   });	
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
		 crudContrllersHelp.initMain('Project','tags','name',$scope);     
	}
])
.controller('ProjectsListCtrl',   [
                'crudContrllersHelp',  '$scope', '$state', '$stateParams', 'globalData',
	function ( crudContrllersHelp, $scope,     $state,     $stateParams,     globalData) {
		crudContrllersHelp.initList('Project','tags','name',$scope);   
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
			return item.productOwnerId==globalData.currentUser.id
		}
		$scope.isDevMgr=function(item) {
			if(!globalData.currentUser) return false;
			return item.devMasterId==globalData.currentUser.id
		}

	}
])
.controller('ProjectsDetailCtrl',   [
                'crudContrllersHelp','$scope','$stateParams', '$state',
	function ( crudContrllersHelp, $scope,$stateParams,   $state) {
		crudContrllersHelp.initDetail('Project','tags','name',$scope);
        $scope.canEdit=function(prj){
			return !!$scope.currentUser&&
			($scope.currentUser.isAdmin||$scope.isProductMgr(prj));
		}

	}
])

.controller('ProjectsCreateCtrl',   [
                '$scope', 'Project',
	function (  $scope,   Project) {
		$scope.item = new Project();
		$scope.item.iterationDuration=4;
		$scope.item.state='TODO';
		$scope.isNew=true;
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
+"[详细参考](http://www.ituring.com.cn/article/775).";

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
  res.forProject = function (projectId,state) {
	   var q={projectId:projectId};
	   if(!!state) q.state=state;
       return res.query(q,{strict:true});
  };
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

angular.module('resources.myevents', ['mongoResourceHttp'])
.factory('MyEvent', ['$mongoResourceHttp', function ($mongoResourceHttp) {
  var res = $mongoResourceHttp('myevents');
  res.load= function (userId,projectId,taskId) {
	  var q={userId:userId};
	  if(!!projectId) q.projectId=projectId;
	  if(!!taskId) q.taskId=taskId;
      return res.query(q,{strict:true});
  }
 
  return res;
}]);

angular.module('resources.projects', ['mongoResourceHttp']);
angular.module('resources.projects').factory('Project', ['$mongoResourceHttp', function ($mongoResourceHttp) {

  var Project = $mongoResourceHttp('projects');

  Project.forProductMgr = function(userId) {
	return Project.query({productOwnerId:userId},{strict:true});
  };

  Project.prototype.isProductOwner = function (userId) {
    return this.productOwnerId === userId;
  };

  Project.prototype.isDevMaster = function (userId) {
    return this.devMasterId === userId;
  };

  Project.prototype.isDevTeamMember = function (userId) {
    return this.teamMembers.indexOf(userId) >= 0;
  };


  Project.prototype.getRoles = function (userId) {
    var roles = [];
    if (this.isProductOwner(userId)) {
      roles.push('产品经理');
    } else {
      if (this.isDevMaster(userId)){
        roles.push('开发组长');
      }
      if (this.isDevTeamMember(userId)){
        roles.push('开发成员');
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
  };
  
  res.forProject = function (projectId,state) {
	   var q={projectId:projectId};
	   if(!!state) q.state=state;
       return res.query(q,{strict:true});
  };
  
  res.forUser = function (userId,state) {
      var q={assignedUserId:userId};
	  if(!!state) q.state=state;
      return res.query(q,{strict:true});
  };

  return res;
}]);

angular.module('resources.users', ['mongoResourceHttp']);
angular.module('resources.users').factory('User', ['$mongoResourceHttp', function ($mongoResourceHttp) {

  var res = $mongoResourceHttp('users');
  /*res.prototype.getFullName = function () {
    return this.lastName + " " + this.firstName + " (" + this.email + ")";
  };*/

  return res;
}]);

angular.module('controllers.users', ['ui.router','ngMessages'
, 'services.i18nNotifications'
,'directives.dropdownSelect'
, 'resources.users'])  
.controller('UsersMainCtrl',   [
               'crudContrllersHelp','$scope', 
	function ( crudContrllersHelp,$scope) {
		
		crudContrllersHelp.initMain('User','code','name',$scope);
		$scope.availableSkills=['协调','后端编码','前端编码','2D做图','3D建模','文档写作','测试'];

		$scope.checkData= function(item){
			var now = new Date();
			if(!item.regDate)
				item.regDate=now;
		}
}])
.controller('UsersListCtrl',   [
                'crudContrllersHelp','$scope',
	function ( crudContrllersHelp, $scope) {
		crudContrllersHelp.initList('User','code','name',$scope);
	    $scope.showTasks = function (item) {
			//console.log('user',item);
	        $scope.$state.go('userTasks' , {userId:item._id});
	   }   
	}
])
.controller('UsersDetailCtrl',   [
               'crudContrllersHelp', '$scope','$stateParams', '$state',
	function ( crudContrllersHelp,$scope,  $stateParams,    $state) {
		crudContrllersHelp.initDetail('User','code','name',$scope);
		$scope.canEdit=function(user){
			return !!$scope.currentUser&&
			             ($scope.currentUser.isAdmin||user._id==$scope.currentUser.id);
		}
		
	}
])
.controller('UsersCreateCtrl',   [
                '$scope', 'User',
	function (  $scope,   User) {
		$scope.item = new User();
		$scope.item.isActive=true;
		$scope.item.type='S';
		$scope.item.isAdmin=false;
		$scope.isNew=true;
		$scope.checkData($scope.item);
		$scope.item.desc=
"# 一级标题\r\n"
+"\r\n"
+"## 二级标题\r\n"
+"\r\n"
+"`红色提醒`\r\n"
+"\r\n"
+"\r\n"
+"[详细参考](http://www.ituring.com.cn/article/775).";
	}
])

.controller('UsersEditCtrl',   [
                '$scope', '$http','SERVER_CFG', 
	function (  $scope,$http,SERVER_CFG ) {
		$scope.item = $scope.findById( $scope.$stateParams.itemId);
		$scope.checkData($scope.item);
		var url = SERVER_CFG.URL+'/images/'+$scope.item.code;
		$scope.isNew=false
		$http.get(url).then(function(reps){
		   $scope.imgs=reps.data;
		   //console.log($scope.imgs);
		});
	
	}
])
.controller('UsersListTasksCtrl',   [
                '$scope', '$http','SERVER_CFG', 
	function (  $scope,$http,SERVER_CFG ) {
		$scope.item = $scope.findById( $scope.$stateParams.itemId);
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
.directive('uniqueCode', [
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
		  	$http.post(baseURL+'users/uniqueCode',{code:viewValue})
		  	.then(function(resp){
				 var result=resp.data.uniqueCode
				 console.log('users/uniqueCode--',result)
				 ctrl.$setValidity('uniqueCode', result )
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
		     $scope.okItems = globalData.toResourcesArray(Backlog,data.OK);
		 });
	 	
	 	$scope.myPrjs=globalData.mgrPrjs;
	 	 $log.debug('myPrjs:',$scope.myPrjs);
	    var dialog=null;
	    
	    function onDialogClose(success) {
			   $log.debug('onDialogClose',success);
			   if(success&&$scope.item) {
			        $log.debug('UPDTATE:',$scope.item);
			        $scope.item.$update();
		        }
		        dialog = null;
		        return success;
	    }


  
	    $scope.edit = function (item) {
			 //$scope.item=item;
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
+"\r\n"
+"var app = express()\r\n"
+"```\r\n"
+"\r\n"
+"[详细参考](http://www.ituring.com.cn/article/775)."
                    
              $scope.item.$save().then(function(data){
				  $scope.item=data;
				  console.log($scope.item);
                  $scope.todoItems.push($scope.item);
			  });
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
       
      // globalData.exchange=null;
       $scope.save=function() {
			dialog.close(true);
	    }	
	
		$scope.cancel= function() {
           dialog.close(false);
        };
   
	   
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
