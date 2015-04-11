angular.module('productbacklogs', ['resources.productbacklogs', 'services.crud'])

  .config(['crudRouteProvider', function(crudRouteProvider){
  
  
    // projectId is a helper method wrapped with DI annotation that will be used in
    // route resolves in this file.
    var projectId = ['$route', function($route) {
      return $route.current.params.projectId;
    }];
  
  
    // Create the CRUD routes for editing the product backlog
    crudRouteProvider.routesFor('ProductBacklogs', 'projects', 'projects/:projectId')
      // How to handle the "list product backlog items" route
      .whenList({
        projectId: projectId,
        backlog : ['$route', 'ProductBacklogs', function($route, ProductBacklogs){
          return ProductBacklogs.forProject($route.current.params.projectId);
        }]
      })
      
      // How to handle the "create a new product backlog item" route
      .whenNew({
        projectId: projectId,
        backlogItem : ['$route', 'ProductBacklogs', function($route, ProductBacklogs){
          return new ProductBacklogs({projectId:$route.current.params.projectId});
        }]
      })
    
      // How to handle the "edit a product backlog item" route
      .whenEdit({
        projectId: projectId,
        backlogItem : ['$route', 'ProductBacklogs', function($route, ProductBacklogs){
          return ProductBacklogs.getById($route.current.params.itemId);
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
