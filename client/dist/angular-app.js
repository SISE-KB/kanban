angular.module('app', [
  'ngRoute',
  'projectsinfo',
  'dashboard',
  'projects',
  'admin',
  'services.breadcrumbs',
  'services.i18nNotifications',
  'services.httpRequestTracker',
  'security',
  'directives.crud',
  'templates.app',
  'templates.common',
  'ngSanitize',
  'ui.select',
  'ui.bootstrap.tpls']);



angular.module('app').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider.otherwise({redirectTo:'/projectsinfo'});
}]);

angular.module('app').run(['security', function(security) {
  // Get the current user when the application starts
  // (in case they are still logged in from a previous session)
  security.requestCurrentUser();
}]);

angular.module('app').controller('AppCtrl', ['$scope', 'i18nNotifications', 'localizedMessages', function($scope, i18nNotifications, localizedMessages) {

  $scope.notifications = i18nNotifications;

  $scope.removeNotification = function (notification) {
    i18nNotifications.remove(notification);
  };

  $scope.$on('$routeChangeError', function(event, current, previous, rejection){
    i18nNotifications.pushForCurrentRoute('errors.route.changeError', 'error', {}, {rejection: rejection});
  });
}]);

angular.module('app').controller('HeaderCtrl', ['$scope', '$location', '$route', 'security', 'breadcrumbs', 'notifications', 'httpRequestTracker',
  function ($scope, $location, $route, security, breadcrumbs, notifications, httpRequestTracker) {
  $scope.location = $location;
  $scope.breadcrumbs = breadcrumbs;

  $scope.isAuthenticated = security.isAuthenticated;
  $scope.isAdmin = security.isAdmin;

  $scope.home = function () {
    if (security.isAuthenticated()) {
      $location.path('/dashboard');
    } else {
      $location.path('/projectsinfo');
    }
  };

  $scope.isNavbarActive = function (navBarPath) {
    return navBarPath === breadcrumbs.getFirst().name;
  };

  $scope.hasPendingRequests = function () {
    return httpRequestTracker.hasPendingRequests();
  };
}]);

angular.module('app').constant('I18N.MESSAGES', {
  'errors.route.changeError':'前端路由出错',
  'crud.user.save.success':"保存成功用户'{{id}}'",
  'crud.user.remove.success':"'删除成功{{id}}'",
  'crud.user.remove.error':"删除'{{id}}'出错",
  'crud.user.save.error':"保存用户出错...",
  'crud.project.save.success':"项目'{{id}}' 保存成功",
  'crud.project.remove.success':"项目'{{id}}' 删除成功",
  'crud.project.save.error':"保存项目出错...",
  'login.reason.notAuthorized':"无权操作！",
  'login.reason.notAuthenticated':"必须登录后才能访问！",
  'login.error.invalidCredentials': "登录失败，请检查输入是否正确！",
  'login.error.serverError': "服务端错误： {{exception}}."
});

angular.module('admin', ['admin-projects', 'admin-users']);

angular.module('dashboard', ['resources.projects', 'resources.tasks'])

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/dashboard', {
    templateUrl:'dashboard/dashboard.tpl.html',
    controller:'DashboardCtrl',
    resolve:{
      projects:['Project', function (Project) {
        //TODO: need to know the current user here
        return Project.all();
      }],
      tasks:['Task', function (Task) {
        //TODO: need to know the current user here
        return Task.all();
      }]
    }
  });
}])

.controller('DashboardCtrl', ['$scope', '$location', 'projects', 'tasks', function ($scope, $location, projects, tasks) {
  $scope.projects = projects;
  $scope.tasks = tasks;

  $scope.manageBacklogs = function (projectId) {
    $location.path('/projects/' + projectId + '/productbacklogs');
  };

  $scope.manageSprints = function (projectId) {
    $location.path('/projects/' + projectId + '/sprints');
  };
}]);

angular.module('projects', ['resources.projects', 'productbacklogs', 'sprints', 'security.authorization'])

.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
  $routeProvider.when('/projects', {
    templateUrl:'projects/projects-list.tpl.html',
    controller:'ProjectsViewCtrl',
    resolve:{
      projects:['Project', function (Project) {
        //TODO: fetch only for the current user
        return Project.all();
      }],
      authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
    }
  });
}])

.controller('ProjectsViewCtrl', ['$scope', '$location', 'projects', 'security', function ($scope, $location, projects, security) {
  $scope.projects = projects;

  $scope.viewProject = function (project) {
    $location.path('/projects/'+project.$id());
  };

  $scope.manageBacklogs = function (project) {
    $location.path('/projects/'+project.$id()+'/productbacklogs');
  };

  $scope.manageSprints = function (project) {
    $location.path('/projects/'+project.$id()+'/sprints');
  };

  $scope.getMyRoles = function(project) {
    if ( security.currentUser ) {
      return project.getRoles(security.currentUser.id);
    }
  };
}]);

angular.module('projectsinfo', [], ['$routeProvider', function($routeProvider){

  $routeProvider.when('/projectsinfo', {
    templateUrl:'projectsinfo/list.tpl.html',
    controller:'ProjectsInfoListCtrl',
    resolve:{
      projects:['Project', function(Project){
        return Project.all();
      }]
    }
  });
}]);

angular.module('projectsinfo').controller('ProjectsInfoListCtrl', ['$scope', 'projects', function($scope, projects){
  $scope.projects = projects;
}]);

angular.module('resources.productbacklogs', ['mongoResourceHttp']);
angular.module('resources.productbacklogs').factory('ProductBacklog', ['$mongoResourceHttp', function ($mongoResourceHttp) {
  var ProductBacklog = $mongoResourceHttp('productbacklogs');

  ProductBacklog.forProject = function (projectId) {
    return ProductBacklog.query({projectId:projectId});
  };

  return ProductBacklog;
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

angular.module('admin-projects', [
  'resources.projects',
  'resources.users',
  'services.crud',
  'security.authorization'
])

.config(['crudRouteProvider', 'securityAuthorizationProvider', function (crudRouteProvider, securityAuthorizationProvider) {

  var getAllUsers = ['Project', 'User', '$route', function(Project, User, $route){
    return User.all();
  }];

  crudRouteProvider.routesFor('Projects', 'admin')
    .whenList({
      projects: ['Project', function(Project) { return Project.all(); }],
      adminUser: securityAuthorizationProvider.requireAdminUser
    })
    .whenNew({
      project: ['Project', function(Project) { return new Project(); }],
      users: getAllUsers,
      adminUser: securityAuthorizationProvider.requireAdminUser
    })
    .whenEdit({
      project: ['Project', 'User', '$route', function(Project, User, $route) { return Project.getById($route.current.params.itemId); }],
      users: getAllUsers,
      adminUser: securityAuthorizationProvider.requireAdminUser
    });
}])

.controller('ProjectsListCtrl', ['$scope', 'crudListMethods', 'projects', function($scope, crudListMethods, projects) {
  $scope.projects = projects;

  angular.extend($scope, crudListMethods('/admin/projects'));
}])

.controller('ProjectsEditCtrl', ['$scope', '$location', 'i18nNotifications', 'users', 'project', function($scope, $location, i18nNotifications, users, project) {

  $scope.project = project;
  $scope.users = users;

  $scope.onSave = function(project) {
    i18nNotifications.pushForNextRoute('crud.project.save.success', 'success', {id : project.$id()});
    $location.path('/admin/projects');
  };

  $scope.onError = function() {
    i18nNotifications.pushForCurrentRoute('crud.project.save.error', 'danger');
  };

}])

.controller('TeamMembersController', ['$scope', function($scope) {
  $scope.project.teamMembers = $scope.project.teamMembers || [];

  //prepare users lookup, just keep references for easier lookup
  $scope.usersLookup = {};
  angular.forEach($scope.users, function(value, key) {
    $scope.usersLookup[value.$id()] = value;
  });

  $scope.productOwnerCandidates = function() {
    return $scope.users.filter(function(user) {
      return $scope.usersLookup[user.$id()] && $scope.project.canActAsProductOwner(user.$id());
    });
  };

  $scope.scrumMasterCandidates = function() {
    return $scope.users.filter(function(user) {
      return $scope.usersLookup[user.$id()] && $scope.project.canActAsScrumMaster(user.$id());
    });
  };

  $scope.teamMemberCandidates = function() {
    return $scope.users.filter(function(user) {
      return $scope.usersLookup[user.$id()] && $scope.project.canActAsDevTeamMember(user.$id()) && !$scope.project.isDevTeamMember(user.$id());
    });
  };

  $scope.selTeamMember = undefined;

  $scope.addTeamMember = function() {
    if($scope.selTeamMember) {
      $scope.project.teamMembers.push($scope.selTeamMember);
      $scope.selTeamMember = undefined;
    }
  };

  $scope.removeTeamMember = function(teamMember) {
    var idx = $scope.project.teamMembers.indexOf(teamMember);
    if(idx >= 0) {
      $scope.project.teamMembers.splice(idx, 1);
    }
    // If we have removed the team member that is currently selected then clear this object
    if($scope.selTeamMember === teamMember) {
      $scope.selTeamMember = undefined;
    }
  };
}]);

angular.module('admin-users-edit',[
  'services.crud',
  'services.i18nNotifications',
  'admin-users-edit-uniqueMobileNo',
  'admin-users-edit-validateEquals'
])

.controller('UsersEditCtrl', ['$scope', '$location', 'i18nNotifications', 'user', function ($scope, $location, i18nNotifications, user) {

  $scope.user = user;
  $scope.password = user.password;
  $scope.availableSkills=['协调','后端编码','前端编码','2D做图','3D建模','文档写作','测试'];
  $scope.onSave = function (user) {
    i18nNotifications.pushForNextRoute('crud.user.save.success', 'success', {id : user.name});
    $location.path('/admin/users');
  };

  $scope.onError = function() {
    i18nNotifications.pushForCurrentRoute('crud.user.save.error', 'danger');
  };

  $scope.onRemove = function(user) {
    i18nNotifications.pushForNextRoute('crud.user.remove.success', 'success', {id : user.name});
    $location.path('/admin/users');
  };

}]);

angular.module('admin-users-list', [
  'services.crud',
  'services.i18nNotifications'
])

.controller('UsersListCtrl', ['$scope', 'crudListMethods', 'users', 'i18nNotifications', function ($scope, crudListMethods, users, i18nNotifications) {
  $scope.users = users;

  angular.extend($scope, crudListMethods('/admin/users'));

  $scope.remove = function(user, $index, $event) {
    // Don't let the click bubble up to the ng-click on the enclosing div, which will try to trigger
    // an edit of this item.
    $event.stopPropagation();

    // Remove this user
    user.$remove().then(function() {
      // It is gone from the DB so we can remove it from the local list too
      $scope.users.splice($index,1);
      i18nNotifications.pushForCurrentRoute('crud.user.remove.success', 'success', {id : user.$id()});
    }, function() {
      i18nNotifications.pushForCurrentRoute('crud.user.remove.error', 'danger', {id : user.$id()});
    });
  };
}]);

angular.module('admin-users', [
  'admin-users-list',
  'admin-users-edit',
  
  'services.crud',
  'security.authorization'
])

.config(['crudRouteProvider', 'securityAuthorizationProvider', function (crudRouteProvider, securityAuthorizationProvider) {

  crudRouteProvider.routesFor('Users', 'admin')
    .whenList({
      users: ['User', function(User) { return User.all(); }],
      currentUser: securityAuthorizationProvider.requireAdminUser
    })
    .whenNew({
      user: ['User', function(User) { return new User(); }],
      currentUser: securityAuthorizationProvider.requireAdminUser
    })
    .whenEdit({
      user:['$route', 'User', function ($route, User) {
        return User.getById($route.current.params.itemId);
      }],
      currentUser: securityAuthorizationProvider.requireAdminUser
    });
}]);

angular.module('admin-users-edit-uniqueMobileNo', ['resources.users'])

/**
 * A validation directive to ensure that the model contains a unique email address
 * @param  Users service to provide access to the server's user database
  */
.directive('uniqueMobileNo', ["User", function (User) {
  return {
    require:'ngModel',
    restrict:'A',
    link:function (scope, el, attrs, ctrl) {
     //using push() here to run it as the last parser, after we are sure that other validators were run
      ctrl.$parsers.push(function (viewValue) {
        if (viewValue) {
          User.query({mobileNo:viewValue}, function (users) {
            if (users.length === 0) {
              ctrl.$setValidity('uniqueMobileNo', false);
            } else {
              ctrl.$setValidity('uniqueMobileNo', true);
            }
          });
          return viewValue;
        }
      });
    }
  };
}]);

angular.module('admin-users-edit-validateEquals', [])

/**
 * A validation directive to ensure that this model has the same value as some other
 */
.directive('validateEquals', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {

      function validateEqual(myValue, otherValue) {
        if (myValue === otherValue) {
          ctrl.$setValidity('equal', true);
          return myValue;
        } else {
          ctrl.$setValidity('equal', false);
          return undefined;
        }
      }

      scope.$watch(attrs.validateEquals, function(otherModelValue) {
        ctrl.$setValidity('equal', ctrl.$viewValue === otherModelValue);
      });

      ctrl.$parsers.push(function(viewValue) {
        return validateEqual(viewValue, scope.$eval(attrs.validateEquals));
      });

      ctrl.$formatters.push(function(modelValue) {
        return validateEqual(modelValue, scope.$eval(attrs.validateEquals));
      });
    }
  };
});
angular.module('productbacklogs', ['resources.productbacklogs', 'services.crud'])
  .config(['crudRouteProvider', function(crudRouteProvider){
      var projectId = ['$route', function($route) {
         return $route.current.params.projectId;
       }];
     crudRouteProvider.routesFor('ProductBacklogs', 'projects', 'projects/:projectId')
      .whenList({
        projectId: projectId,
        backlog : ['$route', 'ProductBacklog', function($route, ProductBacklog){
          return ProductBacklog.forProject($route.current.params.projectId);
        }]
      })
      
      // How to handle the "create a new product backlog item" route
      .whenNew({
        projectId: projectId,
        backlogItem : ['$route', 'ProductBacklog', function($route, ProductBacklog){
          return new ProductBacklog({projectId:$route.current.params.projectId});
        }]
      })
    
      // How to handle the "edit a product backlog item" route
      .whenEdit({
        projectId: projectId,
        backlogItem : ['$route', 'ProductBacklog', function($route, ProductBacklog){
          return ProductBacklog.getById($route.current.params.itemId);
        }]
      });
  }])
  
  
  
  // The controller for listing product backlog items
  .controller('ProductBacklogsListCtrl', ['$scope', 'crudListMethods', 'projectId', 'backlog', function($scope, crudListMethods, projectId, backlog){
  
    $scope.backlog = backlog;
    
    angular.extend($scope, crudListMethods('/projects/'+projectId+'/productbacklogs'));
  
  }])
  
  
  
  // The controller for editing a product backlog item
  .controller('ProductBacklogsEditCtrl', ['$scope', '$location', 'projectId', 'backlogItem', function($scope, $location, projectId, backlogItem){
  
    $scope.backlogItem = backlogItem;
  
    $scope.onSave = function () {
      //TODO: missing message
      $location.path('/projects/'+projectId+'/productbacklogs');
    };
  
    $scope.onError = function () {
      //TODO: missing message
      $scope.updateError = true;
    };
  
  }]);

angular.module('sprints', ['resources.sprints', 'services.crud', 'tasks'])

.config(['crudRouteProvider', function(crudRouteProvider){

  var projectId = ['$route', function($route) {
    return $route.current.params.projectId;
  }];

  var productBacklogs = ['$route', 'ProductBacklog', function ($route, ProductBacklog) {
    return ProductBacklog.forProject($route.current.params.projectId);
  }];

  crudRouteProvider.routesFor('Sprints', 'projects', 'projects/:projectId')
  .whenList({
    projectId: projectId,
    sprints: ['$route', 'Sprint', function($route, Sprint){
      return Sprint.forProject($route.current.params.projectId);
    }]
  })

  .whenNew({
    projectId: projectId,
    sprint: ['$route', 'Sprint', function($route, Sprint){
      return new Sprint({projectId:$route.current.params.projectId});
    }],
    productBacklogs : productBacklogs
  })

  .whenEdit({
    projectId: projectId,
    sprint: ['$route', 'Sprint', function($route, Sprint){
      return Sprint.getById($route.current.params.itemId);
    }],
    productBacklogs : productBacklogs
  });

}])

.controller('SprintsListCtrl', ['$scope', '$location', 'crudListMethods', 'projectId', 'sprints', function($scope, $location, crudListMethods, projectId, sprints){
  $scope.sprints = sprints;

  angular.extend($scope, crudListMethods('/projects/'+projectId+'/sprints'));

  $scope.tasks = function (sprint) {
    $location.path('/projects/'+projectId+'/sprints/'+sprint.$id()+'/tasks');
  };
}])

.controller('SprintsEditCtrl', ['$scope', '$location', 'projectId', 'sprint', 'productBacklogs', function($scope, $location, projectId, sprint, productBacklogs){

  $scope.productBacklogs = productBacklogs;
  $scope.sprint = sprint;

  $scope.onSave = function () {
    $location.path('/projects/'+projectId+'/sprints');
  };
  $scope.onError = function () {
    $scope.updateError = true;
  };
  
  $scope.sprint.sprintBacklogs = $scope.sprint.sprintBacklogs || [];

  $scope.productBacklogLookup = {};
  angular.forEach($scope.productBacklogs, function (productBacklogItem) {
    $scope.productBacklogLookup[productBacklogItem.$id()] = productBacklogItem;
  });

  $scope.viewProductBacklogItem = function (productBacklogItemId) {
    $location.path('/projects/'+projectId+'/productbacklogs/'+productBacklogItemId);
  };

  $scope.addBacklogItem = function (backlogItem) {
    $scope.sprint.sprintBacklogs.push(backlogItem.$id());
  };

  $scope.removeBacklogItem = function (backlogItemId) {
    $scope.sprint.sprintBacklogs.splice($scope.sprint.sprintBacklogs.indexOf(backlogItemId),1);
  };

  $scope.estimationInTotal = function () {
    var totalEstimation = 0;
    angular.forEach(sprint.sprintBacklogs, function (backlogItemId) {
      totalEstimation += $scope.productBacklogLookup[backlogItemId].estimation;
    });
    return totalEstimation;
  };

  $scope.notSelected = function (productBacklogItem) {
    return $scope.sprint.sprintBacklogs.indexOf(productBacklogItem.$id())===-1;
  };
}]);

angular.module('tasks', ['resources.tasks', 'services.crud'])

.config(['crudRouteProvider', function (crudRouteProvider) {

  var sprintBacklogItems = ['Sprint', 'ProductBacklog', '$route', function (Sprint, ProductBacklog, $route) {
    var sprintPromise = Sprints.getById($route.current.params.sprintId);
    return sprintPromise.then(function (sprint) {
      return ProductBacklog.getByObjectIds(sprint.sprintBacklogs);
    });
  }];

  var teamMembers = ['Project', 'User', '$route', function (Project, User, $route) {
    var projectPromise = Project.getById($route.current.params.projectId);
    return projectPromise.then(function(project){
      return User.getByObjectIds(project.teamMembers);
    });
  }];

  crudRouteProvider.routesFor('Tasks', 'projects/sprints', 'projects/:projectId/sprints/:sprintId')

  .whenList({
    tasks:['Task', '$route', function (Task, $route) {
      return Task.forSprint($route.current.params.sprintId);
    }]
  })

  .whenNew({
    task:['Tasks', '$route', function (Tasks, $route) {
      return new Tasks({
        projectId:$route.current.params.projectId,
        sprintId:$route.current.params.sprintId,
        state:Tasks.statesEnum[0]
      });
    }],
    sprintBacklogItems:sprintBacklogItems,
    teamMembers:teamMembers
  })

  .whenEdit({
    task:['Tasks', '$route', function (Tasks, $route) {
      return Tasks.getById($route.current.params.itemId);
    }],
    sprintBacklogItems:sprintBacklogItems,
    teamMembers:teamMembers
  });
}])

.controller('TasksListCtrl', ['$scope', 'crudListMethods', '$route', 'tasks', function ($scope, crudListMethods, $route, tasks) {
  $scope.tasks = tasks;

  var projectId = $route.current.params.projectId;
  var sprintId = $route.current.params.sprintId;
  angular.extend($scope, crudListMethods('/projects/' + projectId + '/sprints/' + sprintId + '/tasks'));
}])

.controller('TasksEditCtrl', ['$scope', '$location', '$route', 'Tasks', 'sprintBacklogItems', 'teamMembers', 'task', function ($scope, $location, $route, Tasks, sprintBacklogItems, teamMembers, task) {
  $scope.task = task;
  $scope.statesEnum = Tasks.statesEnum;
  $scope.sprintBacklogItems = sprintBacklogItems;
  $scope.teamMembers = teamMembers;

  $scope.onSave = function () {
    $location.path('/admin/users');
  };
  $scope.onError = function() {
    $scope.updateError = true;
  };
}]);
