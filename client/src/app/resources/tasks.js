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
