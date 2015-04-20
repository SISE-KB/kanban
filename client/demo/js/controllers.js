'use strict';
/**********************************************************************
 * Home controller
 **********************************************************************/
angular.module('myApp')
.controller('HomeCtrl', function($scope,$log,APP_CONFIG, data,files) {
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
      var imgurl=APP_CONFIG.imagesDir+fn;
      slides.push({
        image: imgurl,
        text: ''
      });
    }; 
  
  for(var i=0;i<files.length;i++)
     $scope.addSlide(files[i]);  
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
.controller('AdminCtrl', function($scope,$http,$upload,$timeout,loggedin) {
	$scope.tip = '';
	$scope.username='demo'
	$scope.msg = {title:'this is title',
	  text:'# 1级标题\n'+
           '## 2级标题\n'+
           '普通段落:\n'+
           '\n'+
           '    代码块：\n\n'+
           '[详细参考](http://www.ituring.com.cn/article/775)'
	  };
	$scope.sendMsg=function(msg) {
        $scope.socket.emit('message', msg);//in $rootScope
        $http.post('/api/messages', msg).success(function(m){
           $scope.tip="OK";

        }).error(function(){
           $scope.tip = 'Save failed.';
       });
    };
	$scope.$watch('files', function(files) {
		$scope.formUpload = false;
		if (files != null) {
			for (var i = 0; i < files.length; i++) {
				$scope.errorMsg = null;
				(function(file) {
					generateThumbAndUpload(file);
				})(files[i]);
			}
		}
	});
	
	$scope.uploadPic = function(files) {
		$scope.formUpload = true;
		if (files != null) {
			generateThumbAndUpload(files[0])
		}
	};
	
	function generateThumbAndUpload(file) {
		$scope.errorMsg = null;
		$scope.generateThumb(file);
		uploadUsing$upload(file);
		
	}
	
	$scope.generateThumb = function(file) {
		if (file != null) {
			if ( file.type.indexOf('image') > -1) {//$scope.fileReaderSupported &&
				$timeout(function() {
					var fileReader = new FileReader();
					fileReader.readAsDataURL(file);
					fileReader.onload = function(e) {
						$timeout(function() {
							file.dataUrl = e.target.result;
						});
					}
				});
			}
		}
	};
	
	function uploadUsing$upload(file) {
		file.upload = $upload.upload({
			url:'/upload',
			method: 'POST',
			headers: {
				'my-header' : 'my-header-value'
			},
			fields: {username: $scope.username},
			file: file,
			fileFormDataName: 'myFile'
		});

		file.upload.then(function(response) {
			$timeout(function() {
				file.result = response.data;
			});
		}, function(response) {
			if (response.status > 0)
				$scope.errorMsg = response.status + ': ' + response.data;
		});

		file.upload.progress(function(evt) {
			// Math.min is to fix IE which reports 200% sometimes
			file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
		});

		file.upload.xhr(function(xhr) {
			// xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
		});
	}
	
	$scope.getReqParams = function() {
		return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
				'&errorMessage=' + $scope.serverErrorMsg : '';
	};
   
});
