angular.module('resources.issues', ['mongoResourceHttp'])

angular.module('resources.issues').factory('Issue', ['$mongoResourceHttp', function ($mongoResourceHttp) {

  var res = $mongoResourceHttp('issues');
  res.forProject = function (projectId) {
    return res.query({projectId:projectId},{strict:true});
  };

  return res;
}]);
