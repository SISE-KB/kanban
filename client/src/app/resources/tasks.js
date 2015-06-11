angular.module('resources.tasks', ['mongoResourceHttp']);
angular.module('resources.tasks').factory('Task', ['$mongoResourceHttp', function ($mongoResourceHttp) {

  var res = $mongoResourceHttp('tasks');

  //res.statesEnum = ['TODO', 'DOING', 'BLOCKED', 'TEST', 'DONE', 'OK'];

  res.forSprint= function (sprintId,state) {
	  var q={sprintId:sprintId};
	  if(!!state) q.state=state;
      return res.query(q,{strict:true});
  }
  res.forProject = function (projectId) {
    return res.query({projectId:projectId},{strict:true});
  };
  
  res.forUser = function (userId,state) {
      var q={assignedUserId:userId};
	  if(!!state) q.state=state;
      return res.query(q,{strict:true});
  };

  return res;
}]);
