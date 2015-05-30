angular.module('controllers.issues', 
['ui.router'
, 'services.i18nNotifications'
, 'resources.users'
, 'resources.issues'
])  

.controller('IssuesMainCtrl',   [
               'crudContrllersHelp','$rootScope','$scope','$state',   '$stateParams',  'Project','User',
	function ( crudContrllersHelp,$rootScope,$scope,   $state,   $stateParams,   Project,User) {
	   crudContrllersHelp.initMain('Issue','name',$scope,   $state,   $stateParams)
       if(!$rootScope.exchangeData){
		   //User.query({isActive:true,isAdmin:false},{strict:true}).then(function(ds){
			 $scope.users =[]
		  //})
	   }else{
		   Project.getById($rootScope.exchangeData.projectId).then(function(prj){
			  // console.log(prj)
			  // var members=[ ]
			 //  for(var i=0;i<prj.teamMembers.length;i++)
			 //     members.push(''+prj.teamMembers[i])
			  
		      // console.log(members)   
			   User.getByObjectIds(prj.teamMembers).then(function(ds){
				    $scope.users=ds
				  //   console.log(ds)   
				})
		   })
		}   
	   $scope.checkDate= function(item){
			var now = new Date()
			if(!item.regDate)
				item.regDate=now
			if(!item.closeDate)
				item.closeDate= now.setDate(now.getDate()+14)
		}

	}
])
.controller('IssuesListCtrl',   [
                 'crudContrllersHelp','$scope', '$state', '$stateParams', 
	function ( crudContrllersHelp, $scope,   $state,   $stateParams) {
		crudContrllersHelp.initList('Issue','name',$scope,   $state,   $stateParams)
	}
])
.controller('IssuesDetailCtrl',   [
                 'crudContrllersHelp','$scope','$stateParams', '$state',
	function ( crudContrllersHelp, $scope,$stateParams,   $state) {
		crudContrllersHelp.initDetail('Issue','name',$scope,   $state,   $stateParams)
	}
])

.controller('IssuesCreateCtrl',   [
                '$rootScope','$scope', 'Issue','$stateParams',
	function ( $rootScope, $scope,   Issue ,$stateParams) {
		$scope.item = new Issue()
		$scope.isNew=true
		$scope.checkDate($scope.item)
		if(!!$rootScope.exchangeData){
		   $scope.item.targetType=$rootScope.exchangeData.targetType
		   $scope.item.target=$rootScope.exchangeData.target
		   $scope.item.projectId=$rootScope.exchangeData.projectId
	       $scope.item.backlogId=$rootScope.exchangeData.backlogId
		   $scope.item.state='TODO'
		   $rootScope.exchangeData=null
		}  
	}
])

.controller('IssuesEditCtrl',   [
                '$scope', '$stateParams', '$state', 'Project','User',
	function (  $scope,   $stateParams,   $state,Project,User) {
		$scope.isNew=false
		$scope.item = $scope.findById( $stateParams.itemId)
		$scope.checkDate($scope.item)
		if(!$scope.item.projectId) return
		Project.getById($scope.item.projectId).then(function(prj){
		      User.getByObjectIds(prj.teamMembers).then(function(ds){
				    $scope.users=ds
			  })
		   })
	}
])
