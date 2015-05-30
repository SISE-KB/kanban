angular.module('controllers.projects', ['ui.router','ngMessages'
, 'services.i18nNotifications'
, 'resources.projects'
, 'resources.users'
])  
.controller('ProjectsMainCtrl',   [
               'crudContrllersHelp','$scope', '$state', '$stateParams', '$http','Project','SERVER_CFG',
	function ( crudContrllersHelp,$scope,   $state,   $stateParams,    $http, Project,SERVER_CFG) {
 		/*User.query({isActive:true,isAdmin:false},{strict:true}).then(function(ds){
			$scope.users =ds
		})*/
			var baseURL= SERVER_CFG.URL+'/api/'
		  	$http.post(baseURL+'users/load',{})//只加载主要资料
		  	.then(function(resp){
				  var data=resp.data
				  console.log('users/load--',data)
				  $scope.users =data
          })
		crudContrllersHelp.initMain('Project','name',$scope,   $state,   $stateParams)     
	}
])
.controller('ProjectsListCtrl',   [
                'security','crudContrllersHelp','$rootScope','$scope', '$state', '$stateParams', 'i18nNotifications', 
	function ( security,crudContrllersHelp,$rootScope, $scope,   $state,   $stateParams,    i18nNotifications) {
		crudContrllersHelp.initList('Project','name',$scope,   $state,   $stateParams)
		$scope.backlogs=function (item) {
			$state.go('backlogs-list', {projectId: item.$id()})
		}
		$scope.issues=function (item) {
			$rootScope.exchangeData={targetType:'项目',target: item.name
				                            ,projectId:item.$id(),backlogId:null}
			$state.go('issues.create')
		}
		$scope.isProductMgr=function(item) {
		    if(!security.currentUser) return false;
		    var mgrId=security.currentUser.id;
			//console.log(mgrId,item.productOwner)
			return item.productOwner==mgrId
		}
		$scope.isDevMgr=function(item) {
		    if(!security.currentUser) return false;
		    var mgrId=security.currentUser.id;
			//console.log(mgrId,item.procMaster)
			return item.procMaster==mgrId
		}

	}
])
.controller('ProjectsDetailCtrl',   [
                'crudContrllersHelp','$scope','$stateParams', '$state',
	function ( crudContrllersHelp, $scope,$stateParams,   $state) {
		crudContrllersHelp.initDetail('Project','name',$scope,   $state,   $stateParams)


	}
])

.controller('ProjectsCreateCtrl',   [
                '$scope', 'Project',
	function (  $scope,   Project) {
		$scope.item = new Project()
		$scope.item.iterationDuration=4
		$scope.item.isSample=false
		$scope.item.state='TODO'
		$scope.isNew=true

	}
])

.controller('ProjectsEditCtrl',   [
                '$scope', '$stateParams', '$state',
	function (  $scope,   $stateParams,   $state) {
		$scope.item = $scope.findById( $stateParams.itemId)
		$scope.isNew=false

	}
])
