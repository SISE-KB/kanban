angular.module('resources.backlogs', ['mongoResourceHttp'])
.factory('Backlog', ['$mongoResourceHttp', function ($mongoResourceHttp) {
  var res = $mongoResourceHttp('backlogs');

  res.forProject = function (projectId,state) {
	  var q={projectId:projectId};
	  if(!!state) q.state=state;
      return res.query(q,{strict:true});
  };
  res.forSprint= function (sprintId,state) {
	  var q={sprintId:sprintId};
	  if(!!state) q.state=state;
      return res.query(q,{strict:true});
  }
  
  return res;
}])
