'use strict';


var app = angular.module('fileUpload', [ 'ngFileUpload' ]);


app.controller('MyCtrl', [ '$scope', '$http', '$timeout', '$compile', '$upload', function($scope, $http, $timeout, $compile, $upload) {
	$scope.usingFlash = FileAPI && FileAPI.upload != null;
	$scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);

	
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
			if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
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
			//url: 'https://angular-file-upload-cors-srv.appspot.com/upload' + $scope.getReqParams(),
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

	

} ]);
