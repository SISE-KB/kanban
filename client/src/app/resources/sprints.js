angular.module('resources.sprints', ['mongoResourceHttp'])
.factory('Sprint', ['$mongoResourceHttp', function ($mongoResourceHttp) {
  var res = $mongoResourceHttp('sprints');
  res.forProject = function (projectId,state) {
	  var q={projectId:projectId};
	  if(!!state) q.state=state;
      return res.query(q,{strict:true});
  }
  
  return res;
}]);
