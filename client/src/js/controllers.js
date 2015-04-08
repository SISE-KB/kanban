'use strict';
/**********************************************************************
 * Home controller
 **********************************************************************/
angular.module('myApp')
.controller('HomeCtrl', function($scope,$log, data,files) {
  $scope.msgs=data;
  var ds=$scope.msgs;
  $scope.$on('socket:message', function(event,msg){
		$log.info('socket:message',msg);
		ds.push(msg);
		while(ds.length>6)
		   ds.shift();
		$scope.$apply();

	});
   var slides = $scope.slides = [];
   $scope.myInterval = 5000;
   var idx=1;
   $scope.addSlide = function(fn) {
      var imgurl='/' +fn;
      slides.push({
        image: imgurl,
        text: ''
      });
    }; 
  
  for(var i=0;i<files.length;i++)
     $scope.addSlide(files[i]);  
})

.controller('CarouselDemoCtrl', function ($rootScope,$scope,$log) {

})

/**********************************************************************
 * User controller
 **********************************************************************/
.controller('UserCtrl', function($scope, $rootScope, $http, $location) {
  // This object will be filled by the form
  $scope.user = {};

  // Register the login() function
  $scope.register = function(){
    $http.post('/register', {
      mobileNo: $scope.user.mobileNo,
      name: $scope.user.name,
      password: $scope.user.password,
    })
    .success(function(user){
      // No error: authentication OK
      $rootScope.errMsg = 'Register successful!';
      $location.url('/admin');
    })
    .error(function(){
      // Error: authentication failed
      $rootScope.errMsg = 'Register failed.';
      $location.url('/login');
    });
  };
   // Register the login() function
  $scope.login = function(){
    $http.post('/login', {
      mobileNo: $scope.user.mobileNo,
      password: $scope.user.password,
    })
    .success(function(user){
      // No error: authentication OK
      $rootScope.errMsg = 'Authentication successful!';
      $location.url('/admin');
    })
    .error(function(){
      // Error: authentication failed
      $rootScope.errMsg = 'Authentication failed.';
      $location.url('/login');
    });
  };
})

/**********************************************************************
 * Admin controller
 **********************************************************************/
.controller('AdminCtrl', function($scope,loggedin) {

  $scope.msg = {title:'this is title',
	  text:'# 1级标题\n'+
           '## 2级标题\n'+
           '普通段落:\n'+
           '\n'+
           '    代码块：\n\n'+
           '[详细参考](http://www.ituring.com.cn/article/775)'
	  };
   
});
