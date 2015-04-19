angular.module('controllers.messages', ['ui.router'
, 'services.i18nNotifications'
, 'resources.messages'
, 'security.authorization'])  
.controller('MessagesMainCtrl',   [
               '$scope', '$state', '$stateParams', 'i18nNotifications', 'messages', 
	function ( $scope,   $state,   $stateParams,    i18nNotifications,   messages) {
              // Add a 'messages' field in this abstract parent's scope, so that all
              // child state views can access it in their scopes. 
		$scope.data = messages
		$scope.availableTags=["娱乐","科技"]
		$scope.visited=[]
		$scope.findById = function (id) {
			for (var i = 0; i < $scope.data.length; i++) {
				var rt=$scope.data[i]
				//console.log(rt)
				if ($scope.data[i].$id() == id)
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
				$scope.data.push(item)
			}
			$state.go('^.list', $stateParams) 
		}
		$scope.onError = function() {
			i18nNotifications.pushForCurrentRoute('crud.save.error', 'danger')
		}
		$scope.onRemove = function(item) {
			i18nNotifications.pushForNextRoute('crud.remove.success', 'success', {id : item.title})
			$scope.removeFromArray($scope.data,item)
			$scope.removeFromArray($scope.visited,item)
			$state.go('^.list', $stateParams) 
		}

	}
])
.controller('MessagesListCtrl',   [
                '$scope', '$state', '$stateParams', 'i18nNotifications', 
	function (  $scope,   $state,   $stateParams,    i18nNotifications) {
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
			$state.go('^.detail', {itemId: item.$id()})
		}
	
		$scope.create = function () {
			$state.go('^.create')
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
			$state.go('^.edit', {itemId: $scope.item.$id()})
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
