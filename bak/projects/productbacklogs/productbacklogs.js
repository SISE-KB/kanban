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
