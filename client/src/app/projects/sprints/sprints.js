angular.module('sprints', ['resources.sprints', 'services.crud', 'tasks'])

.config(['crudRouteProvider', function(crudRouteProvider){

  var projectId = ['$route', function($route) {
    return $route.current.params.projectId;
  }];

  var productBacklogs = ['$route', 'ProductBacklogs', function ($route, ProductBacklogs) {
    return ProductBacklogs.forProject($route.current.params.projectId);
  }];

  crudRouteProvider.routesFor('Sprints', 'projects', 'projects/:projectId')
  .whenList({
    projectId: projectId,
    sprints: ['$route', 'Sprints', function($route, Sprints){
      return Sprints.forProject($route.current.params.projectId);
    }]
  })

  .whenNew({
    projectId: projectId,
    sprint: ['$route', 'Sprints', function($route, Sprints){
      return new Sprints({projectId:$route.current.params.projectId});
    }],
    productBacklogs : productBacklogs
  })

  .whenEdit({
    projectId: projectId,
    sprint: ['$route', 'Sprints', function($route, Sprints){
      return Sprints.getById($route.current.params.itemId);
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
