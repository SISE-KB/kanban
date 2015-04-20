angular.module('projects', ['resources.projects', 'productbacklogs', 'sprints', 'security.authorization'])

.config(['$stateProvider', 'securityAuthorizationProvider', function ($stateProvider, securityAuthorizationProvider) {
  $stateProvider.state('/projects', {
    templateUrl:'projects/projects-list.tpl.html',
    controller:'ProjectsViewCtrl',
   // resolve:{
      projects:['Project', function (Project) {
        //TODO: fetch only for the current user
        return Project.all();
      }]
   // , authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
   // }
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
