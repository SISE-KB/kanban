angular.module('controllers.users', ['ui.router','ngMessages'
, 'services.i18nNotifications'
,'directives.dropdownSelect'
, 'resources.users'])  
.controller('UsersMainCtrl',   [
               'crudContrllersHelp','$scope', 
	function ( crudContrllersHelp,$scope) {
		
		crudContrllersHelp.initMain('User','code','name',$scope);
		$scope.availableSkills=['协调','后端编码','前端编码','2D做图','3D建模','文档写作','测试'];

		$scope.checkData= function(item){
			var now = new Date();
			if(!item.regDate)
				item.regDate=now;
		}
}])
.controller('UsersListCtrl',   [
                'crudContrllersHelp','$scope','globalData',
	function ( crudContrllersHelp, $scope,globalData) {
		crudContrllersHelp.initList('User','code','name',$scope);
	    $scope.showTasks = function (item) {
			//console.log('user',item);
			globalData.exchangeData=item;
	        $scope.$state.go('userTasks' , {userId:item._id});
	   }   
	}
])
.controller('UsersDetailCtrl',   [
               'crudContrllersHelp', '$scope','$stateParams', '$state',
	function ( crudContrllersHelp,$scope,  $stateParams,    $state) {
		crudContrllersHelp.initDetail('User','code','name',$scope);
		$scope.canEdit=function(user){
			return !!$scope.currentUser&&
			             ($scope.currentUser.isAdmin||user._id==$scope.currentUser.id);
		}
		
	}
])
.controller('UsersCreateCtrl',   [
                '$scope', 'User',
	function (  $scope,   User) {
		$scope.item = new User();
		$scope.item.isActive=true;
		$scope.item.type='S';
		$scope.item.isAdmin=false;
		$scope.isNew=true;
		$scope.checkData($scope.item);
		$scope.item.desc=
"# 一级标题\r\n"
+"\r\n"
+"## 二级标题\r\n"
+"\r\n"
+"`红色提醒`\r\n"
+"\r\n"
+"\r\n"
+"[详细参考](http://www.ituring.com.cn/article/775).";
	}
])

.controller('UsersEditCtrl',   [
                '$scope', '$http','SERVER_CFG', 
	function (  $scope,$http,SERVER_CFG ) {
		$scope.item = $scope.findById( $scope.$stateParams.itemId);
		$scope.checkData($scope.item);
		var url = SERVER_CFG.URL+'/images/'+$scope.item.code;
		$scope.isNew=false
		$http.get(url).then(function(reps){
		   $scope.imgs=reps.data;
		   //console.log($scope.imgs);
		});
	
	}
])
.controller('UsersListTasksCtrl',   [
                '$scope', '$http','SERVER_CFG', 
	function (  $scope,$http,SERVER_CFG ) {
		$scope.item = $scope.findById( $scope.$stateParams.itemId);
	}
]);
