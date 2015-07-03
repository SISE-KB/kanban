angular.module('controllers.issues', 
['ui.router'
, 'services.i18nNotifications'
, 'resources.users'
, 'resources.issues'
])  

.controller('IssuesMainCtrl',   [
               'crudContrllersHelp','$scope',  '$log','Project','User','globalData',
	function ( crudContrllersHelp,  $scope,    $log,   Project,  User,   globalData) {
	   crudContrllersHelp.initMain('Issue','name','name',$scope);
	   $scope.curProjectName=null;
	  /* $scope.$watch('curProjectId', function(val) {
		   console.log(val);
           $scope.projectChanged( $scope.curProjectId);
       });*/
	   $scope.projectChanged=function (prjId){
		    if(!prjId) return ;
		   
	   }
       if(!globalData.exchangeData){
				 $scope.users =[];
				 globalData.sendApiRequest('projects/load').then(function(data){
				     $scope.projects=data;
				     if(data.length>0){
						  $scope.curProjectName=data[0].name;
					  }
				  });   
	    }else{
		    
		    Project.getById(globalData.exchangeData.projectId).then(function(prj){
			     $log.debug('IssuesMainCtrl look for prj',prj);
				  User.getByObjectIds(prj.teamMembers).then(function(ds){
					    $scope.users= ds;
					    $log.debug('IssuesMainCtrl the prj members:',ds);
				  });
		   });
		}   
	   $scope.checkDate= function(item){
			var now = new Date();
			if(!item.regDate)
				item.regDate=now;
			if(!item.closeDate)
				item.closeDate= now.setDate(now.getDate()+14);
		}

	}
])
.controller('IssuesListCtrl',   [
                 'crudContrllersHelp','$scope', '$state', '$stateParams', 
	function ( crudContrllersHelp, $scope,   $state,   $stateParams) {
		crudContrllersHelp.initList('Issue','name','name',$scope);
	}
])
.controller('IssuesDetailCtrl',   [
                 'crudContrllersHelp','$scope','$stateParams', '$state',
	function ( crudContrllersHelp, $scope,$stateParams,   $state) {
		crudContrllersHelp.initDetail('Issue','name','name',$scope);
	}
])

.controller('IssuesCreateCtrl',   [
                    '$scope', '$stateParams','Issue','globalData',
	function ( $scope,   $stateParams,    Issue ,globalData) {
		$scope.item = new Issue();
		$scope.isNew=true;
		$scope.checkDate($scope.item);
		if(!!globalData.exchangeData){
		   $scope.item.targetType=globalData.exchangeData.targetType;
		   $scope.item.target=globalData.exchangeData.target;
		   $scope.item.projectId=globalData.exchangeData.projectId;
	       $scope.item.backlogId=globalData.exchangeData.backlogId;
		   $scope.item.state='TODO';
		   globalData.exchangeData=null;
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
