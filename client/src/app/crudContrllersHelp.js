angular.module('app')
.factory('crudContrllersHelp', [
          '$injector',
function ($injector) {
 var initMain = function (ResName,searchField,notifyField,$scope) {
       var   $state=$scope.$state,  
   	         $stateParams=$scope.$stateParams;
		var Res = $injector.get(ResName);
		var i18nNotifications = $injector.get('i18nNotifications');

		var ressName=Res.getName()

		$scope._data = [];//load from server
		$scope.users=[];

		$scope.query = '';
		$scope.visited=[];

		$scope.search=function() {
			var q={};
			q[searchField]=$scope.query;
			Res.query(q).then(function(ds){
				$scope._data=ds;
				$scope.visited=[];
				$state.go(ressName+'.list') ;
		  })
	    }
		$scope.findById = function (id) {
			if(!$scope._data){
				var rt= Res.getById(id);
			    return rt;
			}
			for (var i = 0; i < $scope._data.length; i++) {
				var rt=$scope._data[i];
				if ($scope._data[i].$id() == id)
					return rt;
			}
			return null;
		}
		
		$scope.removeFromArray = function (data,item) {
			var index = data.indexOf(item);
			if (index > -1)
				data.splice(index, 1);
		}
		$scope.addToVisited = function (item) {
			var index = $scope.visited.indexOf(item);
			if (index > -1) 
			$scope.visited.splice(index, 1);
			$scope.visited.push(item);
			while ($scope.visited.length>10)
				$scope.visited.shift();
		}
		$scope.onSave = function (item) {
			i18nNotifications.pushForNextRoute('crud.save.success', 'success', {id : item[notifyField]});
			//console.log($state.current.name)
			var idx=$state.current.name.indexOf('create');
			//console.log(idx)
			if(idx > -1){
				$scope._data.push(item);
			}
			$state.go(ressName+'.list', $stateParams) ;
		}
		$scope.onError = function() {
			i18nNotifications.pushForCurrentRoute('crud.save.error', 'danger');
		}
		$scope.onRemove = function(item) {
			i18nNotifications.pushForCurrentRoute('crud.remove.success', 'success', {id : item[notifyField]});
			$scope.removeFromArray($scope._data,item);
			$scope.removeFromArray($scope.visited,item);
			$state.go(ressName+'.list', $stateParams) ;
		}
	
  }
var initList = function (ResName,searchField,notifyField,$scope) {
       var   $state=$scope.$state,  
   	         $stateParams=$scope.$stateParams;
			 
		var i18nNotifications = $injector.get('i18nNotifications');
		var Res = $injector.get(ResName);

  		$scope.data = [];// display items
		$scope.numPerPage=10;
		$scope.currentPage = 1;
		$scope.totalItems=0;
		
		$scope.setPage = function (pageNo) {
			$scope.currentPage = pageNo;
		}
       
		$scope.maxSize = 5;


		$scope.$watch("currentPage + numPerPage + _data", function() {
			$scope.totalItems = $scope._data.length;
			var begin = (($scope.currentPage - 1) * $scope.numPerPage)
				, end = begin + $scope.numPerPage;

			if(end>$scope._data.length) 
				   end=$scope._data.length;

			$scope.data = $scope._data.slice(begin, end);
		})
  
		$scope.remove = function(item, $index, $event) {
			// Don't let the click bubble up to the ng-click on the enclosing div, which will try to trigger
			// an edit of this item.
			$event.stopPropagation();
			item.$remove().then(function() {
				$scope.onRemove(item);
			}, function() {
				i18nNotifications.pushForCurrentRoute('crud.user.remove.error', 'danger', {id : item[notifyField]});
			})
		}
		var ressName=Res.getName(false,false)
		$scope.view = function (item) {
			$state.go(ressName+'.detail', {itemId: item.$id()});
		}
		$scope.edit = function (item) {
			$state.go(ressName+'.edit', {itemId: item.$id()});
		}
		$scope.create = function () {
			$state.go(ressName+'.create');
		}
		
}
var initDetail = function (ResName,searchField,notifyField,$scope) {
        var   $state=$scope.$state,  
   	         $stateParams=$scope.$stateParams;
		var i18nNotifications = $injector.get('i18nNotifications');
		var Res = $injector.get(ResName);
		$scope.item = $scope.findById( $stateParams.itemId);
		$scope.addToVisited($scope.item);
		var ressName=Res.getName(false,false);
		$scope.edit = function () {
			$state.go(ressName+'.edit', {itemId: $scope.item.$id()});
		}
		$scope.list = function () {
			$state.go(ressName+'.list');
		}
}
  return {
	  initMain:initMain
	,initDetail:initDetail
	,initList:initList  
  };
}])
  
