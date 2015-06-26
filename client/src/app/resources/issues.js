angular.module('resources.issues', ['mongoResourceHttp'])

angular.module('resources.issues').factory('Issue', ['$mongoResourceHttp', function ($mongoResourceHttp) {

  var res = $mongoResourceHttp('issues');
  res.forProject = function (projectId,state) {
	   var q={projectId:projectId};
	   if(!!state) q.state=state;
       return res.query(q,{strict:true});
  };
  return res;
}]);
