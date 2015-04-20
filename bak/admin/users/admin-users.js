angular.module('admin-users', [
  'admin-users-list',
  'admin-users-edit',
  'services.crud',
  'security.authorization'
])

.config(['crudRouteProvider', 'securityAuthorizationProvider', function (crudRouteProvider, securityAuthorizationProvider) {

  crudRouteProvider.routesFor('Users', 'admin')
    .whenList({
      users: ['User', function(User) { return User.all(); }],
      currentUser: securityAuthorizationProvider.requireAdminUser
    })
    .whenNew({
      user: ['User', function(User) { return new User(); }],
      currentUser: securityAuthorizationProvider.requireAdminUser
    })
    .whenEdit({
      user:['$route', 'User', function ($route, User) {
		// console.log($route.current.params.itemId);
        return User.getById($route.current.params.itemId);
      }],
      currentUser: securityAuthorizationProvider.requireAdminUser
    });
}]);
