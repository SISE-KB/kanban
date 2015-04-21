angular.module('controllers.messages', ['ui.router'
, 'services.i18nNotifications'
, 'resources.messages'
, 'security.authorization'])  
.controller('MessagesMainCtrl',   [
               '$scope', '$state', '$stateParams', 'i18nNotifications','$http','Message',
	function ( $scope,   $state,   $stateParams,    i18nNotifications,  $http,  Message) {
      
		$scope._data = []//load from server
		$scope.data = []// display items
		$scope.query = ''
		$scope.availableTags=["娱乐","科技"]
		$scope.visited=[]
		$scope.numPerPage=10
		$scope.totalItems=10
		$scope.currentPage = 1
		
		$scope.search=function() {
			var q={'title':$scope.query}
			//console.log(q)
			$http.get('/api/messages', {params: {q:q}}).success(function(msgs){
				ds=[]
				for(var i=0;i<msgs.length;i++)
					ds.push(new Message(msgs[i]))
				$scope._data=ds
				$scope.visited=[]
				$scope.totalItems = $scope._data.length
				console.log($scope.totalItems)
				$scope.data = $scope._data.slice(0, $scope.numPerPage)
				var begin = (($scope.currentPage - 1) * $scope.numPerPage)
				, end = begin + $scope.numPerPage
			$scope.data = $scope._data.slice(begin, end)
			$scope.totalItems = $scope._data.length
			$scope.currentPage = 1
			console.log('totalItems',$scope.totalItems)
			console.log('currentPage',$scope.currentPage)
				
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
			i18nNotifications.pushForNextRoute('crud.save.success', 'success', {id : item.title})
			//console.log($state.current.name)
			var idx=$state.current.name.indexOf('create')
			//console.log(idx)
			if(idx > -1){
				$scope._data.push(item)
				$scope.data.push(item)
			}
			$state.go('messages.list', $stateParams) 
		}
		$scope.onError = function() {
			i18nNotifications.pushForCurrentRoute('crud.save.error', 'danger')
		}
		$scope.onRemove = function(item) {
			i18nNotifications.pushForNextRoute('crud.remove.success', 'success', {id : item.title})
			$scope.removeFromArray($scope._data,item)
			$scope.removeFromArray($scope.data,item)
			$scope.removeFromArray($scope.visited,item)
			$state.go('messages.list', $stateParams) 
		}

	}
])
.controller('MessagesListCtrl',   [
                '$scope', '$state', '$stateParams', 'i18nNotifications', 
	function (  $scope,   $state,   $stateParams,    i18nNotifications) {
		
		

		$scope.setPage = function (pageNo) {
			$scope.currentPage = pageNo
		}
       
		$scope.maxSize = 5
		

		$scope.$watch("currentPage + numPerPage + totalItems", function() {
			var begin = (($scope.currentPage - 1) * $scope.numPerPage)
				, end = begin + $scope.numPerPage
				if(end>$scope._data.length) 
				   end=$scope._data.length
			//$scope.data = $scope._data.slice(begin, end)
			//$scope.totalItems = $scope._data.length
						
				$scope.data=[]
				for(var i=begin;i<end;i++)
				   	$scope.data.push($scope._data[i])
			//$scope.currentPage = 1
			console.log('begin',begin)
			console.log('end',end)
            console.log($scope.data.length)
			//$scope.$apply()
		})
  
		$scope.remove = function(item, $index, $event) {
			// Don't let the click bubble up to the ng-click on the enclosing div, which will try to trigger
			// an edit of this item.
			$event.stopPropagation()
			item.$remove().then(function() {
				$scope.onRemove(item)
			}, function() {
				i18nNotifications.pushForCurrentRoute('crud.user.remove.error', 'danger', {id : item.title})
			})
		}
		$scope.view = function (item) {
			$state.go('messages.list.detail', {itemId: item.$id()})
		}
	
		$scope.create = function () {
			$state.go('messages.create')
		}
	}
])
.controller('MessagesCreateCtrl',   [
                '$scope', 'Message',
	function (  $scope,   Message) {
		$scope.item = new Message()
		var now=new Date()
		$scope.item.recDate=now
		$scope.item.closeDate= now.setDate(now.getDate()+14)
	}
])
.controller('MessagesDetailCtrl',   [
                '$scope','$stateParams', '$state',
	function (  $scope,$stateParams,   $state) {
		$scope.item = $scope.findById( $stateParams.itemId)
		$scope.addToVisited($scope.item)
		
		$scope.edit = function () {
			$state.go('messages.edit', {itemId: $scope.item.$id()})
		}
	}
])
.controller('MessagesEditCtrl',   [
                '$scope', '$stateParams', '$state',
	function (  $scope,   $stateParams,   $state) {
		$scope.item = $scope.findById( $stateParams.itemId)
	/*	$scope.openDate = function($event) {
			$event.preventDefault()
			$event.stopPropagation()
			$scope.dateSelectOpened = true
			//console.log('openDate',$scope.dateSelectOpened)
		}*/
	}
])
