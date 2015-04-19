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
