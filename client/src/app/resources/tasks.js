angular.module('resources.tasks', ['mongoResourceHttp']);
angular.module('resources.tasks').factory('Task', ['$mongoResourceHttp', function ($mongoResourceHttp) {

  var res = $mongoResourceHttp('tasks');

  //res.statesEnum = ['TODO', 'IN_DEV', 'BLOCKED', 'IN_TEST', 'DONE'];

  res.forSprint= function (sprintId,state) {
	  var q={sprintId:sprintId};
	  if(!!state) q.state=state;
      return res.query(q,{strict:true});
  }
  res.forProject = function (projectId) {
    return Task.query({projectId:projectId});
  };

  return res;
}]);
