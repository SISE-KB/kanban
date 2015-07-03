angular.module('controllers.backlogs', ['ui.router','ngMessages'
, 'services.i18nNotifications'
, 'resources.projects'
, 'resources.backlogs'
, 'resources.users'
]) 
 .config(['$stateProvider', 
 function($stateProvider){
	$stateProvider
		.state('backlogs', {
				url: "/backlogs/:projectId",
				templateUrl: 'views/projects/backlogs/index.tpl.html',
				controller: 'BacklogsListCtrl'
		})
		
 }])

 .controller('BacklogsListCtrl', [
              '$scope', '$log','$modal','Backlog','globalData',
    function($scope,     $log, $modal , Backlog,  globalData){
		var projectId = $scope.$stateParams.projectId;
		//$scope.projectId=projectId;
        globalData.sendApiRequest("backlogs/stats",{projectId:projectId})
       .then(function(data){
		     $log.debug(data);
		     $scope.todoItems = globalData.toResourcesArray(Backlog,data.TODO ); 
		     $scope.doingItems = globalData.toResourcesArray(Backlog,data.DOING );
		     $scope.doneItems = globalData.toResourcesArray(Backlog,data.DONE);
		     $scope.okItems = globalData.toResourcesArray(Backlog,data.OK);
		 });
	 	
	 	$scope.myPrjs=globalData.mgrPrjs;
	 	 $log.debug('myPrjs:',$scope.myPrjs);
	    var dialog=null;
	    
	    function onDialogClose(success) {
			   $log.debug('onDialogClose',success);
			   if(success&&$scope.item) {
			        $log.debug('UPDTATE:',$scope.item);
			        $scope.item.$update();
		        }
		        dialog = null;
		        return success;
	    }


  
	    $scope.edit = function (item) {
			 //$scope.item=item;
			 dialog = $modal.open({ templateUrl:'views/projects/backlogs/edit.tpl.html'
					                    , controller: 'BacklogsEditCtrl'});
             dialog.result.then(onDialogClose);
             globalData.exchange=[dialog,item];
		};


		$scope.addBacklog = function () {
			  $scope.item = new Backlog();
			  $scope.item.state="TODO";
              $scope.item.projectId=projectId;
              $scope.item.name=$scope.newText;
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
+"\r\n"
+"var app = express()\r\n"
+"```\r\n"
+"\r\n"
+"[详细参考](http://www.ituring.com.cn/article/775)."
                    
              $scope.item.$save().then(function(data){
				  $scope.item=data;
				  console.log($scope.item);
                  $scope.todoItems.push($scope.item);
			  });
		}
			
		$scope.updateState = function (item) {
			globalData.sendApiRequest("backlogs/update",{id:item._id,state:item.state});
		};
	
		var makeConfig =function(state) {
			return {
				animation: 150,
				group: {name : state,put: ['TODO','DOING','DONE','OK']},
				onAdd: function(item){
					$log.debug("onAdd--",item.model.name);
					item.model.state=state;
					$scope.updateState(item.model);
				}	
			};
        };
        $scope.todoConfig=makeConfig('TODO');
        $scope.doingConfig=makeConfig('DOING');
        $scope.doneConfig=makeConfig('DONE');  
        $scope.okConfig=makeConfig('OK');
  }])

  .controller('BacklogsEditCtrl', [
             '$scope', 'globalData',
    function($scope, globalData){
       
       var dialog=globalData.exchange[0];
       $scope.item=globalData.exchange[1];
       
      // globalData.exchange=null;
       $scope.save=function() {
			dialog.close(true);
	    }	
	
		$scope.cancel= function() {
           dialog.close(false);
        };
   
	   
  }])
