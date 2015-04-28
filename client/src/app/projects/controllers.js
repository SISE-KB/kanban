angular.module('controllers.projects', ['ui.router'
, 'services.i18nNotifications'
, 'directives.dropdownMultiselect'
, 'resources.projects'])  
.controller('ProjectsMainCtrl',   [
               '$scope', '$state', '$stateParams', 'i18nNotifications','Project',
	function ( $scope,   $state,   $stateParams,    i18nNotifications,  Project) {
      
		$scope._data = []//load from server

		$scope.query = ''
		$scope.availableTags=["3D","2D"]
		$scope.visited=[]

		
		$scope.search=function() {
			var q={'name':$scope.query}
			Message.query(q).then(function(msgs){
				//console.log(msgs)
				$scope._data=msgs
				$scope.visited=[]
				
		  })
	    }
		$scope.findById = function (id) {
			for (var i = 0; i < $scope._data.length; i++) {
				var rt=$scope._data[i]
				//
				if ($scope._data[i].$id() == id)
					return rt
			}
			return null
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
			$scope.visited.push(item)
			while ($scope.visited.length>10)
				$scope.visited.shift()
		}
		$scope.onSave = function (item) {
			i18nNotifications.pushForNextRoute('crud.save.success', 'success', {id : item.name})
			//console.log($state.current.name)
			var idx=$state.current.name.indexOf('create')
			//console.log(idx)
			if(idx > -1){
				$scope._data.push(item)
				
			}
			$state.go('projects.list', $stateParams) 
		}
		$scope.onError = function() {
			i18nNotifications.pushForCurrentRoute('crud.save.error', 'danger')
		}
		$scope.onRemove = function(item) {
			i18nNotifications.pushForCurrentRoute('crud.remove.success', 'success', {id : item.name})
			$scope.removeFromArray($scope._data,item)
			$scope.removeFromArray($scope.visited,item)
			$state.go('projects.list', $stateParams) 
		}
	

	}
])
.controller('ProjectsListCtrl',   [
                '$scope', '$state', '$stateParams', 'i18nNotifications', 
	function (  $scope,   $state,   $stateParams,    i18nNotifications) {
		
		$scope.data = []// display items
		$scope.numPerPage=10
		$scope.currentPage = 1
		$scope.totalItems=0
		
		$scope.setPage = function (pageNo) {
			$scope.currentPage = pageNo
		}
       
		$scope.maxSize = 5


		$scope.$watch("currentPage + numPerPage + _data", function() {
			$scope.totalItems = $scope._data.length
			var begin = (($scope.currentPage - 1) * $scope.numPerPage)
				, end = begin + $scope.numPerPage

			if(end>$scope._data.length) 
				   end=$scope._data.length

			$scope.data = $scope._data.slice(begin, end)
		})
  
		$scope.remove = function(item, $index, $event) {
			// Don't let the click bubble up to the ng-click on the enclosing div, which will try to trigger
			// an edit of this item.
			$event.stopPropagation()
			item.$remove().then(function() {
				$scope.onRemove(item)
			}, function() {
				i18nNotifications.pushForCurrentRoute('crud.user.remove.error', 'danger', {id : item.name})
			})
		}
		$scope.view = function (item) {
			$state.go('projects.list.detail', {itemId: item.$id()})
		}
	
		$scope.create = function () {
			$state.go('projects.create')
		}
	}
])
.controller('ProjectsCreateCtrl',   [
                '$scope', 'Project',
	function (  $scope,   Project) {
		$scope.item = new Project()

	}
])
.controller('ProjectsDetailCtrl',   [
                '$scope','$stateParams', '$state',
	function (  $scope,$stateParams,   $state) {
		$scope.item = $scope.findById( $stateParams.itemId)
		$scope.addToVisited($scope.item)
		
		$scope.edit = function () {
			$state.go('projects.edit', {itemId: $scope.item.$id()})
		}
	}
])
.controller('ProjectsEditCtrl',   [
                '$scope', '$stateParams', '$state',
	function (  $scope,   $stateParams,   $state) {
		$scope.item = $scope.findById( $stateParams.itemId)
		$scope.item.tags=$scope.item.tags||[]

	}
])
