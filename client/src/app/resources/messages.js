angular.module('resources.messages', ['mongoResourceHttp'])

.factory('Message', ['$mongoResourceHttp', function ($mongoResourceHttp) {

  var resource = $mongoResourceHttp('messages');
  /*resource.prototype.getFullName = function () {
    return this.lastName + " " + this.firstName + " (" + this.email + ")";
  };*/

  return resource;
}]);
