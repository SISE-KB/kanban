angular.module('resources.productbacklogs', ['mongoResourceHttp']);
angular.module('resources.productbacklogs').factory('ProductBacklog', ['$mongoResourceHttp', function ($mongoResourceHttp) {
  var ProductBacklog = $mongoResourceHttp('productbacklogs');

  ProductBacklog.forProject = function (projectId) {
    return ProductBacklog.query({projectId:projectId});
  };

  return ProductBacklog;
}]);
