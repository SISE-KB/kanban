angular.module('resources.myevents', ['mongoResourceHttp'])
.factory('MyEvent', ['$mongoResourceHttp', function ($mongoResourceHttp) {
  var res = $mongoResourceHttp('myevents');
  res.load= function (userId,projectId,taskId) {
	  var q={userId:userId};
	  if(!!projectId) q.projectId=projectId;
	  if(!!taskId) q.taskId=taskId;
      return res.query(q,{strict:true});
  }
 
  return res;
}]);
