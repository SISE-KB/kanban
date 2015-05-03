angular.module('controllers.users', ['ui.router','ngMessages'
, 'services.i18nNotifications'
, 'directives.dropdownMultiselect'
, 'resources.users'])  
.controller('UsersMainCtrl',   [
               '$scope', '$state', '$stateParams', 'i18nNotifications', 'User',
	function ( $scope,   $state,   $stateParams,    i18nNotifications,User) {
        $scope._ress="users"
		$scope._data =[]//load from server
		$scope.data = []// display items
		
		$scope.availableSkills=['协调','后端编码','前端编码','2D做图','3D建模','文档写作','测试']
		$scope.visited=[]
		
		$scope.query = ''
		$scope.search=function() {
			var q={'name':$scope.query}
			//console.log(q)
			User.query(q).then(function(msgs){
				$scope._data=msgs
				$scope.visited=[]
				$state.go($scope._ress+'.list', $stateParams) 
				
		  })
	    }

		$scope.findById = function (id) {
			//console.log($scope._data.length)
			for (var i = 0; i < $scope._data.length; i++) {
				var rt=$scope._data[i]
				//
				if (rt.$id() == id)
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
			$state.go($scope._ress+'.list', $stateParams) 
		}
		$scope.onError = function() {
			i18nNotifications.pushForCurrentRoute('crud.save.error', 'danger')
		}
		$scope.onRemove = function(item) {
			i18nNotifications.pushForCurrentRoute('crud.remove.success', 'success', {id : item.name})
			$scope.removeFromArray($scope._data,item)
			$scope.removeFromArray($scope.visited,item)
			$state.go($scope._ress+'.list', $stateParams) 
		}
		$scope.checkDate= function(item){
			var now = new Date(Date.now())
			if(!item.regDate)
				item.regDate=now
		}

	}
])
.controller('UsersListCtrl',   [
                '$scope', '$state', '$stateParams', 'i18nNotifications', 'User',
	function (  $scope,   $state,   $stateParams,    i18nNotifications,  User) {
		

		$scope.numPerPage=10
		$scope.currentPage = 1
		$scope.totalItems=0
		$scope.maxSize = 5
		
				
		$scope.setPage = function (pageNo) {
			$scope.currentPage = pageNo
		}


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
			$state.go($scope._ress+'.detail', {itemId: item.$id()})
		}
		$scope.edit = function (item) {
			$state.go($scope._ress+'.edit', {itemId: item.$id()})
		}

		$scope.create = function () {
			$state.go($scope._ress+'.create')
		}
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
.controller('UsersDetailCtrl',   [
                '$scope','$stateParams', '$state',
	function ( $scope,  $stateParams,    $state) {
		$scope.item = $scope.findById( $stateParams.itemId)
		
		$scope.addToVisited($scope.item)
		
		$scope.edit = function () {
			$state.go($scope._ress+'.edit', {itemId: $scope.item.$id()})
		}
		$scope.list = function () {
			$state.go($scope._ress+'.list')
		}
	}
])
.controller('UsersEditCtrl',   [
                '$scope', '$stateParams', '$state',
	function (  $scope,   $stateParams,   $state) {
		$scope.item = $scope.findById( $stateParams.itemId)
		$scope.checkDate($scope.item)
	}
])
