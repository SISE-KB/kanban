angular.module('resources.productbacklogs', ['mongoResourceHttp']);
angular.module('resources.productbacklogs').factory('ProductBacklogs', ['$mongoResourceHttp', function ($mongoResourceHttp) {
  var ProductBacklogs = $mongoResourceHttp('productbacklogs');

  ProductBacklogs.forProject = function (projectId) {
    return ProductBacklogs.query({projectId:projectId});
  };

  return ProductBacklogs;
}]);
