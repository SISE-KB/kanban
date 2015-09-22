angular.module('controllers.projects', ['ui.router','ngMessages'
, 'services.i18nNotifications'
, 'resources.projects'
, 'resources.users'
])  
.controller('ProjectsMainCtrl',   [
               'crudContrllersHelp','$scope', '$state', '$stateParams', 'globalData',
	function ( crudContrllersHelp,$scope,   $state,   $stateParams,  globalData) {
         $scope.users=[]
         globalData.sendApiRequest('users/load')
         .then(function(data){
			 $scope.users=data;
		}) ;
	 crudContrllersHelp.initMain('Project','tags','name',$scope);   
         $scope.isProductMgr=function(item) {
		    if(!globalData.currentUser) return false;
			return item.productOwnerId==globalData.currentUser.id||globalData.currentUser.isAdmin
		}
	$scope.isDevMgr=function(item) {
			if(!globalData.currentUser) return false;
			return item.devMasterId==globalData.currentUser.id||globalData.currentUser.isAdmin
		}
	/*$scope.isOwner=function(item) {
			if(!globalData.currentUser) return false;
			return globalData.currentUser.isAdmin
                             ||item.devMasterId==globalData.currentUser.id
                             ||item.productOwnerId==globalData.currentUser.id
                               
		} */ 
	}
])
.controller('ProjectsListCtrl',   [
                'crudContrllersHelp',  '$scope', '$state', '$stateParams', 'globalData',
	function ( crudContrllersHelp, $scope,     $state,     $stateParams,     globalData) {
		crudContrllersHelp.initList('Project','tags','name',$scope);   
			$scope.backlogs=function (item) {
			$state.go('backlogs', {projectId: item.$id()})
		}
		$scope.sprints=function (item) {
			$state.go('sprints', {projectId: item.$id()})
		}
		$scope.issues=function (item) {
			globalData.exchangeData={targetType:'项目',target: item.name
				                            ,projectId:item.$id(),backlogId:null}
			$state.go('issues.create')
		}
		

	}
])
.controller('ProjectsDetailCtrl',   [
                'crudContrllersHelp','$scope','$stateParams', '$state',
	function ( crudContrllersHelp, $scope,$stateParams,   $state) {
		crudContrllersHelp.initDetail('Project','tags','name',$scope);
        $scope.canEdit=function(prj){
			return !!$scope.currentUser&&
			($scope.currentUser.isAdmin||$scope.isProductMgr(prj));
		}

	}
])

.controller('ProjectsCreateCtrl',   [
                '$scope', 'Project',
	function (  $scope,   Project) {
		$scope.item = new Project();
		$scope.item.iterationDuration=4;
		$scope.item.state='TODO';
		$scope.isNew=true;
		$scope.item.desc=
"# 一级标题\r\n"
+"\r\n"
+"## 二级标题\r\n"
+"\r\n"
+"`红色提醒`\r\n"
+"\r\n"
+"**Code**:\r\n"
+"\r\n"
+"```js\r\n"
+"var express = require('express')\r\n"
+"var multer  = require('multer')\r\n"
+"\r\n"
+"var app = express()\r\n"
+"app.use(multer({ dest: './uploads/'}))\r\n"
+"```\r\n"
+"\r\n"
+"[详细参考](http://www.ituring.com.cn/article/775).";

	}
])

.controller('ProjectsEditCtrl',   [
                '$scope', '$stateParams', '$state',
	function (  $scope,   $stateParams,   $state) {
		$scope.item = $scope.findById( $stateParams.itemId)
		$scope.isNew=false

	}
])
