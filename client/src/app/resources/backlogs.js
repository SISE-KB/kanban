angular.module('resources.backlogs', ['mongoResourceHttp'])

.factory('Backlog', ['$mongoResourceHttp', function ($mongoResourceHttp) {
  var res = $mongoResourceHttp('backlogs');

  res.forProject = function (projectId) {
      return res.query({projectId:projectId},{strict:true});
  }

  return res
}])
