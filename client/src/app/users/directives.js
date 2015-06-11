angular.module('controllers.users')  
.directive('validateEquals', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      function validateEqual(myValue, otherValue) {
        if (myValue === otherValue) {
          ctrl.$setValidity('equal', true)
          return myValue
        } else {
          ctrl.$setValidity('equal', false)
          return undefined
        }
      }

      scope.$watch(attrs.validateEquals, function(otherModelValue) {
        ctrl.$setValidity('equal', ctrl.$viewValue === otherModelValue)
      })

      ctrl.$parsers.push(function(viewValue) {
        return validateEqual(viewValue, scope.$eval(attrs.validateEquals))
      })

      ctrl.$formatters.push(function(modelValue) {
        return validateEqual(modelValue, scope.$eval(attrs.validateEquals))
      })
    }
  }
})
.directive('uniqueCode', [
            "$http","SERVER_CFG",
 function ($http,SERVER_CFG) {
  return {
    require:'ngModel',
    restrict:'A',
    link:function (scope, el, attrs, ctrl) {
     //using push() here to run it as the last parser, after we are sure that other validators were run
      ctrl.$parsers.push(function (viewValue) {
        if (viewValue) {
		  	var baseURL= SERVER_CFG.URL+'/api/'
		  	$http.post(baseURL+'users/uniqueCode',{code:viewValue})
		  	.then(function(resp){
				 var result=resp.data.uniqueCode
				 console.log('users/uniqueCode--',result)
				 ctrl.$setValidity('uniqueCode', result )
          })
          return viewValue
        }
      })
    }
  }
}])
