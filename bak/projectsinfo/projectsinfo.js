angular.module('projectsinfo', ['ui.router'], ['$stateProvider', function($stateProvider){

  $stateProvider.state('/projectsinfo', {
    templateUrl:'projectsinfo/list.tpl.html',
    controller:'ProjectsInfoListCtrl',
    projects:['Project', function(Project){
        return Project.all();
     }]
 
  });
}]);

angular.module('projectsinfo').controller('ProjectsInfoListCtrl', ['$scope', 'projects', function($scope, projects){
  $scope.projects = projects;
}]);
