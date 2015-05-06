angular.module('app', [ 'ngAnimate','ngMessages', 'ui.router','ngDroplet'
,'ngSanitize',  'ui.select'
 ,'hc.marked', 'ui.bootstrap'
,'services.i18nNotifications', 'services.httpRequestTracker','services.stateBuilderProvider',
,'directives.crud', 'security'
,'resources','controllers'
])
.config(['$stateProvider','$urlRouterProvider', 
function ($stateProvider,$urlRouterProvider) {
  $urlRouterProvider
       .otherwise('/');
        
  $stateProvider
    .state('home',  {
	  url: '/home',	
      template: '<h1>项目状态看板.....</h1>'
    }) 
    .state('demo',  {
	  url: '/',	
      templateUrl: 'views/upload.tpl.html'
    })
   			
}])
.run(
  [          '$rootScope', '$state', '$stateParams','security',
    function ($rootScope,   $state,   $stateParams,security,stateBuilder) {
      $rootScope.$state = $state
      $rootScope.$stateParams = $stateParams
      $rootScope.currentUser=security.requestCurrentUser()
      $rootScope.isAuthenticated = security.isAuthenticated
      $rootScope.isAdmin = security.isAdmin
	  
    }
  ]
)
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
}])
.controller('HeaderCtrl', [
            '$scope',  'security', 'notifications', 'httpRequestTracker',
  function ($scope,  security,  notifications, httpRequestTracker) {

  
  $scope.hasPendingRequests = function () {
    return httpRequestTracker.hasPendingRequests()
  }
  $scope.home = function () {
    if (security.isAuthenticated()) {
         $scope.$state.go('home');
    } else {
         $scope.$state.go('demo');
    }
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
])
angular.module('resources', [
 'resources.messages'
,'resources.users'
,'resources.projects'
,'resources.backlogs'
])

angular.module('app')
.value('SERVER_CFG',{URL:'http://127.0.0.1:3000'})
.config(['stateBuilderProvider', 
function (stateBuilderProvider) {
   stateBuilderProvider.statesFor('User') 
   stateBuilderProvider.statesFor('Message') 
   stateBuilderProvider.statesFor('Project')   			
}])
.config(['uiSelectConfig', function(uiSelectConfig) {
  uiSelectConfig.theme = 'bootstrap';
}])





angular.module('app')
.controller('IndexController', function IndexController($scope, $timeout) {

        /**
         * @property interface
         * @type {Object}
         */
        $scope.interface = {};

        /**
         * @property uploadCount
         * @type {Number}
         */
        $scope.uploadCount = 0;

        /**
         * @property success
         * @type {Boolean}
         */
        $scope.success = false;

        /**
         * @property error
         * @type {Boolean}
         */
        $scope.error = false;
$scope.interface.useParser=function (responseText) {
   // console.log(responseText);
    return responseText;
};
        // Listen for when the interface has been configured.
        $scope.$on('$dropletReady', function whenDropletReady() {

            $scope.interface.allowedExtensions(['png', 'jpg', 'bmp', 'gif', 'svg', 'torrent']);
            $scope.interface.setRequestUrl('upload');
            $scope.interface.defineHTTPSuccess([/2.{2}/]);
            $scope.interface.useArray(false);

        });

        // Listen for when the files have been successfully uploaded.
        $scope.$on('$dropletSuccess', function onDropletSuccess(event, response, files) {

            $scope.uploadCount = files.length;
            $scope.success     = true;
			//console.log(response);
			for(var i=0;i<response.names.length;i++){
			    console.log(response.names[i])
			 // var file=files[i].file;
             // console.log(file.type,file.name,file.size);
            }

            $timeout(function timeout() {
                $scope.success = false;
            }, 5000);

        });

        // Listen for when the files have failed to upload.
        $scope.$on('$dropletError', function onDropletError(event, response) {

            $scope.error = true;
            console.log(response);

            $timeout(function timeout() {
                $scope.error = false;
            }, 5000);

        });

    });

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

angular.module('controllers.messages', ['ui.router','ngMessages'
, 'services.i18nNotifications'
, 'directives.dropdownMultiselect'
, 'resources.messages'])  
.controller('MessagesMainCtrl',   [
               '$scope', '$state', '$stateParams', 'i18nNotifications','Message',
	function ( $scope,   $state,   $stateParams,    i18nNotifications,  Message) {
      
		$scope._data = []//load from server

		$scope.query = ''
		$scope.availableTags=["娱乐","科技"]
		$scope.visited=[]

		
		$scope.search=function() {
			var q={'title':$scope.query}
			Message.query(q).then(function(msgs){
				//console.log(msgs)
				$scope._data=msgs
				$scope.visited=[]
				
		  })
	    }
		$scope.findById = function (id) {
			for (var i = 0; i < $scope._data.length; i++) {
				var rt=$scope._data[i]
				//
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
			i18nNotifications.pushForNextRoute('crud.save.success', 'success', {id : item.title})
			//console.log($state.current.name)
			var idx=$state.current.name.indexOf('create')
			//console.log(idx)
			if(idx > -1){
				$scope._data.push(item)
				
			}
			$state.go('messages.list', $stateParams) 
		}
		$scope.onError = function() {
			i18nNotifications.pushForCurrentRoute('crud.save.error', 'danger')
		}
		$scope.onRemove = function(item) {
			i18nNotifications.pushForCurrentRoute('crud.remove.success', 'success', {id : item.title})
			$scope.removeFromArray($scope._data,item)
			$scope.removeFromArray($scope.visited,item)
			$state.go('messages.list', $stateParams) 
		}
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
                '$scope', '$state', '$stateParams', 'i18nNotifications', 
	function (  $scope,   $state,   $stateParams,    i18nNotifications) {
		
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
				i18nNotifications.pushForCurrentRoute('crud.user.remove.error', 'danger', {id : item.title})
			})
		}
		$scope.view = function (item) {
			$state.go('messages.detail', {itemId: item.$id()})
		}
	
		$scope.create = function () {
			$state.go('messages.create')
		}
	}
])
.controller('MessagesCreateCtrl',   [
                '$scope', 'Message',
	function (  $scope,   Message) {
		$scope.item = new Message()
		/*var now=new Date()
		$scope.item.recDate=now
		$scope.item.closeDate= now.setDate(now.getDate()+14)*/
		$scope.checkDate($scope.item)
	}
])
.controller('MessagesDetailCtrl',   [
                '$scope','$stateParams', '$state',
	function (  $scope,$stateParams,   $state) {
		$scope.item = $scope.findById( $stateParams.itemId)
		$scope.addToVisited($scope.item)
		
		$scope.edit = function () {
			$state.go('messages.edit', {itemId: $scope.item.$id()})
		}
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

angular.module('controllers.projects', ['ui.router','ngMessages'
, 'services.i18nNotifications'
, 'resources.projects'
, 'resources.users'
])  
.controller('ProjectsMainCtrl',   [
               '$scope', '$state', '$stateParams', 'i18nNotifications','Project','User',
	function ( $scope,   $state,   $stateParams,    i18nNotifications, Project,User) {
      
		$scope._data = []//load from server
		$scope.users=[]

		$scope.query = ''
	//	$scope.availableStates=['计划','开发中','完成','失败']
		$scope.visited=[]

		User.all().then(function(ds){
				//console.log(ds)
			$scope.users =ds
	   })
		$scope.search=function() {
			var q={'name':$scope.query}
			Project.query(q).then(function(ds){
				//console.log(ds)
				$scope._data=ds
				$scope.visited=[]
				$state.go('projects.list') 
		  })
	    }
		$scope.findById = function (id) {
			for (var i = 0; i < $scope._data.length; i++) {
				var rt=$scope._data[i]
				//
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
			i18nNotifications.pushForNextRoute('crud.save.success', 'success', {id : item.name})
			//console.log($state.current.name)
			var idx=$state.current.name.indexOf('create')
			//console.log(idx)
			if(idx > -1){
				$scope._data.push(item)
				
			}
			$state.go('projects.list', $stateParams) 
		}
		$scope.onError = function() {
			i18nNotifications.pushForCurrentRoute('crud.save.error', 'danger')
		}
		$scope.onRemove = function(item) {
			i18nNotifications.pushForCurrentRoute('crud.remove.success', 'success', {id : item.name})
			$scope.removeFromArray($scope._data,item)
			$scope.removeFromArray($scope.visited,item)
			$state.go('projects.list', $stateParams) 
		}
	

	}
])
.controller('ProjectsListCtrl',   [
                '$scope', '$state', '$stateParams', 'i18nNotifications', 
	function (  $scope,   $state,   $stateParams,    i18nNotifications) {
		
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
				i18nNotifications.pushForCurrentRoute('crud.user.remove.error', 'danger', {id : item.name})
			})
		}
		$scope.view = function (item) {
			$state.go('projects.detail', {itemId: item.$id()})
		}
	
		$scope.create = function () {
			$state.go('projects.create')
		}
		$scope.backlogs=function (item) {
			$state.go('backlogs-list', {projectId: item.$id()})
		}
	}
])
.controller('ProjectsCreateCtrl',   [
                '$scope', 'Project',
	function (  $scope,   Project) {
		$scope.item = new Project()
		$scope.item.iterationDuration=4
		$scope.item.isSample=false

	}
])
.controller('ProjectsDetailCtrl',   [
                '$scope','$stateParams', '$state',
	function (  $scope,$stateParams,   $state) {
		$scope.item = $scope.findById( $stateParams.itemId)
		$scope.addToVisited($scope.item)
		
		$scope.edit = function () {
			$state.go('projects.edit', {itemId: $scope.item.$id()})
		}
	}
])
.controller('ProjectsEditCtrl',   [
                '$scope', '$stateParams', '$state',
	function (  $scope,   $stateParams,   $state) {
		$scope.item = $scope.findById( $stateParams.itemId)
		//$scope.userNameFilter
		

	}
])

angular.module('resources.backlogs', ['mongoResourceHttp'])

.factory('Backlog', ['$mongoResourceHttp', function ($mongoResourceHttp) {
  var res = $mongoResourceHttp('backlogs');

  res.forProject = function (projectId) {
      return res.query({projectId:projectId},{strict:true});
  }

  return res
}])

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

  Project.forUser = function(userId, successcb, errorcb) {
    return Project.query({}, successcb, errorcb);
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

angular.module('controllers.users', ['ui.router','ngMessages'
, 'services.i18nNotifications'
, 'directives.dropdownMultiselect'
, 'resources.users'])  
.controller('UsersMainCtrl',   [
               '$scope', '$state', '$stateParams', 'i18nNotifications', 'User',
	function ( $scope,   $state,   $stateParams,    i18nNotifications,User) {
        $scope._ress="users"
		$scope._data =[]//load from server
		$scope.data = []// display items
		
		$scope.availableSkills=['协调','后端编码','前端编码','2D做图','3D建模','文档写作','测试']
		$scope.visited=[]
		
		$scope.query = ''
		$scope.search=function() {
			var q={'name':$scope.query}
			//console.log(q)
			User.query(q).then(function(msgs){
				$scope._data=msgs
				$scope.visited=[]
				$state.go($scope._ress+'.list', $stateParams) 
				
		  })
	    }

		$scope.findById = function (id) {
			//console.log($scope._data.length)
			for (var i = 0; i < $scope._data.length; i++) {
				var rt=$scope._data[i]
				//
				if (rt.$id() == id)
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
			i18nNotifications.pushForNextRoute('crud.save.success', 'success', {id : item.name})
			//console.log($state.current.name)
			var idx=$state.current.name.indexOf('create')
			//console.log(idx)
			if(idx > -1){
				$scope._data.push(item)
				
			}
			$state.go($scope._ress+'.list', $stateParams) 
		}
		$scope.onError = function() {
			i18nNotifications.pushForCurrentRoute('crud.save.error', 'danger')
		}
		$scope.onRemove = function(item) {
			i18nNotifications.pushForCurrentRoute('crud.remove.success', 'success', {id : item.name})
			$scope.removeFromArray($scope._data,item)
			$scope.removeFromArray($scope.visited,item)
			$state.go($scope._ress+'.list', $stateParams) 
		}
		$scope.checkDate= function(item){
			var now = new Date(Date.now())
			if(!item.regDate)
				item.regDate=now
		}

	}
])
.controller('UsersListCtrl',   [
                '$scope', '$state', '$stateParams', 'i18nNotifications', 'User',
	function (  $scope,   $state,   $stateParams,    i18nNotifications,  User) {
		

		$scope.numPerPage=10
		$scope.currentPage = 1
		$scope.totalItems=0
		$scope.maxSize = 5
		
				
		$scope.setPage = function (pageNo) {
			$scope.currentPage = pageNo
		}


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
				i18nNotifications.pushForCurrentRoute('crud.user.remove.error', 'danger', {id : item.name})
			})
		}
		$scope.view = function (item) {
			$state.go($scope._ress+'.detail', {itemId: item.$id()})
		}
		$scope.edit = function (item) {
			$state.go($scope._ress+'.edit', {itemId: item.$id()})
		}

		$scope.create = function () {
			$state.go($scope._ress+'.create')
		}
	}
])
.controller('UsersCreateCtrl',   [
                '$scope', 'User',
	function (  $scope,   User) {
		$scope.item = new User()
		$scope.item.isActive=true
		$scope.item.isAdmin=false
		$scope.checkDate($scope.item)
	}
])
.controller('UsersDetailCtrl',   [
                '$scope','$stateParams', '$state',
	function ( $scope,  $stateParams,    $state) {
		$scope.item = $scope.findById( $stateParams.itemId)
		
		$scope.addToVisited($scope.item)
		
		$scope.edit = function () {
			$state.go($scope._ress+'.edit', {itemId: $scope.item.$id()})
		}
		$scope.list = function () {
			$state.go($scope._ress+'.list')
		}
	}
])
.controller('UsersEditCtrl',   [
                '$scope', '$stateParams', '$state',
	function (  $scope,   $stateParams,   $state) {
		$scope.item = $scope.findById( $stateParams.itemId)
		$scope.checkDate($scope.item)
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
					// projectId: projectId,
					 backlogs : [     '$stateParams', 'Backlog', 
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
             '$scope',  'backlogs', '$state','$stateParams',
    function($scope,   backlogs, $state,$stateParams){
      $scope.data = backlogs;
      $scope.create = function () {
		 $state.go('backlogs-create', 
		  {projectId:$stateParams.projectId}
		  )
	  }
   
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
