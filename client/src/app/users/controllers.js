angular.module('controllers.users', ['ui.router','ngMessages'
, 'services.i18nNotifications'
, 'directives.dropdownMultiselect'
, 'resources.users'])  
.controller('UsersMainCtrl',   [
               'crudContrllersHelp','$scope', '$state', '$stateParams', 
	function ( crudContrllersHelp,$scope,   $state,   $stateParams) {
		
		crudContrllersHelp.initMain('User','name',$scope,   $state,   $stateParams)
		$scope.availableSkills=['协调','后端编码','前端编码','2D做图','3D建模','文档写作','测试']

		$scope.checkDate= function(item){
			var now = new Date(Date.now())
			if(!item.regDate)
				item.regDate=now
		}

	}
])
.controller('UsersListCtrl',   [
                'crudContrllersHelp','$scope', '$state', '$stateParams',
	function ( crudContrllersHelp, $scope,   $state,   $stateParams) {
		crudContrllersHelp.initList('User','name',$scope,   $state,   $stateParams)
	}
])
.controller('UsersDetailCtrl',   [
               'crudContrllersHelp', '$scope','$stateParams', '$state',
	function ( crudContrllersHelp,$scope,  $stateParams,    $state) {
		crudContrllersHelp.initDetail('User','name',$scope,   $state,   $stateParams)
		
	}
])
.controller('UsersCreateCtrl',   [
                '$scope', 'User',
	function (  $scope,   User) {
		$scope.item = new User()
		$scope.item.isActive=true
		$scope.item.isAdmin=false
		$scope.checkDate($scope.item)
	}
])

.controller('UsersEditCtrl',   [
                '$scope', '$stateParams', '$state','$timeout',
	function (  $scope,   $stateParams,   $state,$timeout) {
		$scope.item = $scope.findById( $stateParams.itemId)
		$scope.checkDate($scope.item)
		$scope.interface = {}
		$scope.success = false //for upload image
        $scope.error = false
        $scope.interface.useParser=function (responseText) {
                    return responseText
         }
        $scope.$on('$dropletReady', function whenDropletReady() {
            $scope.interface.allowedExtensions(['png', 'jpg', 'bmp', 'gif', 'svg', 'torrent'])
            $scope.interface.setRequestUrl('upload')
            $scope.interface.defineHTTPSuccess([/2.{2}/])
            $scope.interface.useArray(false)
        })
        $scope.$on('$dropletSuccess', function onDropletSuccess(event, response, files) {
            $scope.uploadCount = files.length
            $scope.success     = true
			console.log(response);
			if($scope.uploadCount>0)
			  $scope.item.image="uploads/"+response.names[0]
		
            $timeout(function timeout() {
                $scope.success = false;
            }, 3000)

        });
	}
])
