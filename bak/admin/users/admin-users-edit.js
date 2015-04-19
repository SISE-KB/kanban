angular.module('admin-users-edit',[
  'services.crud',
  'services.i18nNotifications',
  'admin-users-edit-uniqueMobileNo',
  'admin-users-edit-validateEquals'
])

.controller('UsersEditCtrl', ['$scope', '$location', 'i18nNotifications', function ($scope, $location, i18nNotifications) {
 // this.$inject = ['$scope', '$location', 'i18nNotifications', 'u'];
  $scope.user = {mobileNo:'133'};
  $scope.password = '123';
  $scope.availableSkills=['协调','后端编码','前端编码','2D做图','3D建模','文档写作','测试'];
  
  $scope.openDate = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };
  $scope.onSave = function (user) {
    i18nNotifications.pushForNextRoute('crud.user.save.success', 'success', {id : user.name});
    $location.path('/admin/users');
  };

  $scope.onError = function() {
    i18nNotifications.pushForCurrentRoute('crud.user.save.error', 'danger');
  };

  $scope.onRemove = function(user) {
    i18nNotifications.pushForNextRoute('crud.user.remove.success', 'success', {id : user.name});
    $location.path('/admin/users');
  };

}]);
