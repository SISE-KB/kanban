angular.module('dashboard', ['ui.router','resources.projects', 'resources.tasks'])

.config(['$stateProvider', function ($routeProvider) {
  $routeProvider.state('/dashboard', {
    templateUrl:'dashboard/dashboard.tpl.html',
    controller:'DashboardCtrl',
   // resolve:{
      projects:['Project', function (Project) {
        //TODO: need to know the current user here
        return Project.all();
      }],
      tasks:['Task', function (Task) {
        //TODO: need to know the current user here
        return Task.all();
      }]
  //  }
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
