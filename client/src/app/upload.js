angular.module('app')
.controller('UploadCtrl', [
           '$scope', '$timeout',
function ($scope, $timeout,currentUser) {
        $scope.interface = {};
        $scope.uploadCount = 0;
        $scope.success = false;
        $scope.error = false;
		$scope.interface.useParser=function (responseText) {
		   // console.log(responseText);
			return responseText;
		};
        // Listen for when the interface has been configured.
        $scope.$on('$dropletReady', function whenDropletReady() {
            $scope.interface.allowedExtensions(['png', 'jpg', 'gif','ppt', 'doc', 'docx']);
           // console.log($scope.currentUser);
            $scope.interface.setRequestUrl('upload'+'/'+$scope.currentUser.mobileNo);
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

/*
 * section.container section.droplet droplet comment:after {
    content: "可以直接拖入文件...";
    width: 100%;
    height: 100%;
    pointer-events: none;
    display: inline-block;
    position: absolute;
    z-index: -1;
    font-family: Lato, Arial, Tahoma, Helvetica, sans-serif;
    color: rgba(255, 255, 255, .45);
    text-decoration: none;
    font-weight: normal;
    font-size: 20px;
    line-height: 400px;
    text-align: center;
}

section.container section.droplet droplet.event-dragover comment:after {
    content: "...请放开鼠标!";
}
*/
