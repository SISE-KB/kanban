angular.module('app', [ 'ngAnimate','ngMessages', 'ui.router','ngSanitize',  'ui.select', 'hc.marked', 'ui.bootstrap', 
 'services.i18nNotifications', 'services.httpRequestTracker','services.stateBuilderProvider',
 'directives.crud', 'security',
 'resources','controllers'])
.config(['$stateProvider','$urlRouterProvider', 
function ($stateProvider,$urlRouterProvider) {
  $urlRouterProvider
       .otherwise('/');
        
  $stateProvider
    .state('home',  {
	  url: '/',	
      template: '<h1>项目状态看板.....</h1>'
    }) 
    .state('demo',  {
	  url: '/demo',	
      templateUrl: 'views/demo.tpl.html'
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
      $scope.$state.go('dashboard');
    }
  }
 }])



angular.module('app')
.controller('DatepickerDemoCtrl', ['$scope', function($scope) {
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.showWeeks = true;
  $scope.toggleWeeks = function () {
    $scope.showWeeks = ! $scope.showWeeks;
  };

  $scope.clear = function () {
    $scope.dt = null; 
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = ( $scope.minDate ) ? null : new Date();
  };
  $scope.toggleMin(); 

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 1
  };

  $scope.formats = [ 'yyyy/MM/dd', 'shortDate'];
  $scope.format = $scope.formats[0];
}]);

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

angular.module('controllers',['controllers.messages'])
angular.module('resources', ['resources.messages','resources.users'])

angular.module('app')
.config(['stateBuilderProvider', 
function (stateBuilderProvider) {
   stateBuilderProvider.statesFor('Message')   			
}])



angular.module('controllers.messages', ['ui.router'
, 'services.i18nNotifications'
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
				console.log(msgs)
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
			i18nNotifications.pushForNextRoute('crud.remove.success', 'success', {id : item.title})
			$scope.removeFromArray($scope._data,item)
			$scope.removeFromArray($scope.visited,item)
			$state.go('messages.list', $stateParams) 
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
			$state.go('messages.list.detail', {itemId: item.$id()})
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
		var now=new Date()
		$scope.item.recDate=now
		$scope.item.closeDate= now.setDate(now.getDate()+14)
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
	}
])

angular.module('resources.productbacklogs', ['mongoResourceHttp']);
angular.module('resources.productbacklogs').factory('ProductBacklog', ['$mongoResourceHttp', function ($mongoResourceHttp) {
  var ProductBacklog = $mongoResourceHttp('productbacklogs');

  ProductBacklog.forProject = function (projectId) {
    return ProductBacklog.query({projectId:projectId});
  };

  return ProductBacklog;
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

  Project.forUser = function(userId, successcb, errorcb) {
    //TODO: get projects for this user only (!)
    return Project.query({}, successcb, errorcb);
  };

  Project.prototype.isProductOwner = function (userId) {
    return this.productOwner === userId;
  };
  Project.prototype.canActAsProductOwner = function (userId) {
    return !this.isScrumMaster(userId) && !this.isDevTeamMember(userId);
  };
  Project.prototype.isScrumMaster = function (userId) {
    return this.scrumMaster === userId;
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
