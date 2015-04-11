angular.module('resources.sprints', ['mongoResourceHttp']);
angular.module('resources.sprints').factory('Sprints', ['$mongoResourceHttp', function ($mongoResourceHttp) {

  var Sprints = $mongoResourceHttp('sprints');
  Sprints.forProject = function (projectId) {
    return Sprints.query({projectId:projectId});
  };
  return Sprints;
}]);
