angular.module('resources.users', ['mongoResourceHttp']);
angular.module('resources.users').factory('User', ['$mongoResourceHttp', function ($mongoResourceHttp) {

  var userResource = $mongoResourceHttp('users');
  /*userResource.prototype.getFullName = function () {
    return this.lastName + " " + this.firstName + " (" + this.email + ")";
  };*/

  return userResource;
}]);
