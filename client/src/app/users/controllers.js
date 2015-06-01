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
		$scope.isNew=true
		$scope.checkDate($scope.item)
		$scope.item.desc=
"expressjs/multer [![NPM version](https://badge.fury.io/js/multer.svg)](https://badge.fury.io/js/multer)\r\n"
+"\r\n"
+"Multer is a node.js middleware for handling `multipart/form-data`.\r\n"
+"\r\n"
+"It is written on top of [busboy](https://github.com/mscdex/busboy) for maximum efficiency.\r\n"
+"\r\n"
+"## API\r\n"
+"\r\n"
+"#### Installation\r\n"
+"\r\n"
+"`$ npm install multer`\r\n"
+"\r\n"
+"#### Usage\r\n"
+"\r\n"
+"```js\r\n"
+"var express = require('express')\r\n"
+"var multer  = require('multer')\r\n"
+"\r\n"
+"var app = express()\r\n"
+"app.use(multer({ dest: './uploads/'}))\r\n"
+"```\r\n"
+"\r\n"
+"\r\n"
+"**IMPORTANT**: Multer will not process any form which is not `multipart/form-data`."
	}
])

.controller('UsersEditCtrl',   [
                '$scope', '$stateParams', '$state',
	function (  $scope,   $stateParams,   $state) {
		$scope.item = $scope.findById( $stateParams.itemId)
		$scope.checkDate($scope.item)
		$scope.isNew=false
	
	}
])
