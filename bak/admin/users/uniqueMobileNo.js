angular.module('admin-users-edit-uniqueMobileNo', ['resources.users'])

/**
 * A validation directive to ensure that the model contains a unique email address
 * @param  Users service to provide access to the server's user database
  */
.directive('uniqueMobileNo', ["User", function (User) {
  return {
    require:'ngModel',
    restrict:'A',
    link:function (scope, el, attrs, ctrl) {
     //using push() here to run it as the last parser, after we are sure that other validators were run
      ctrl.$parsers.push(function (viewValue) {
        if (viewValue) {
          User.query({mobileNo:viewValue}, function (users) {
            if (users.length === 0) {
              ctrl.$setValidity('uniqueMobileNo', false);
            } else {
              ctrl.$setValidity('uniqueMobileNo', true);
            }
          });
          return viewValue;
        }
      });
    }
  };
}]);