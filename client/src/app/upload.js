angular.module('app')
.controller('UploadCtrl', [
           '$scope', '$timeout','currentUser',
function ($scope, $timeout,currentUser) {
        $scope.interface = {};
        $scope.uploadCount = 0;
        $scope.success = false;
        $scope.error = false;
		console.log('currentUser',currentUser);
		$scope.interface.useParser=function (responseText) {
		   // console.log(responseText);
			return responseText;
		};
        // Listen for when the interface has been configured.
        $scope.$on('$dropletReady', function whenDropletReady() {
            $scope.interface.allowedExtensions(['png', 'jpg', 'gif','ppt', 'doc', 'docx']);
           // console.log($scope.currentUser);
            $scope.interface.setRequestUrl('upload'+'/'+currentUser.code);
            $scope.interface.defineHTTPSuccess([/2.{2}/]);
            $scope.interface.useArray(false);
        });

        // Listen for when the files have been successfully uploaded.
        $scope.$on('$dropletSuccess', function onDropletSuccess(event, response, files) {
            $scope.uploadCount = files.length;
            $scope.success     = true;
            $scope.filenames  = response.names;
	
            $timeout(function timeout() {
                $scope.success = false;
              //  $scope.filenames=null;
            }, 2000);

        });

        // Listen for when the files have failed to upload.
        $scope.$on('$dropletError', function onDropletError(event, response) {
            $scope.error = true;
            console.log(response);

            $timeout(function timeout() {
                $scope.error = false;
              //  $scope.filenames=null;
            }, 2000);

        });
}]);


