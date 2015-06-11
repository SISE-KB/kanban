angular.module('controllers.messages', ['ui.router','ngMessages'
, 'services.i18nNotifications'
, 'directives.dropdownMultiselect'
, 'resources.messages'])  
.controller('MessagesMainCtrl',   [
                'crudContrllersHelp','$scope', '$state', '$stateParams','Message',
	function ( crudContrllersHelp,  $scope,    $state,    $stateParams,  Message) {

		crudContrllersHelp.initMain('Message','title','title',$scope);
		
		$scope.availableTags=["娱乐","科技"]
			
		$scope.checkDate= function(item){
			var now = new Date(Date.now())
			if(!item.recDate)
				item.recDate=now
			if(!item.closeDate)
				item.closeDate= now.setDate(now.getDate()+14)
		}

	}
])
.controller('MessagesListCtrl',   [
                'crudContrllersHelp','$scope', '$state', '$stateParams', 
	function (  crudContrllersHelp,$scope,   $state,   $stateParams) {
		crudContrllersHelp.initList('Message','title','title',$scope);
	}
])
.controller('MessagesDetailCtrl',   [
                'crudContrllersHelp','$scope','$stateParams', '$state',
	function ( crudContrllersHelp, $scope,$stateParams,   $state) {
		crudContrllersHelp.initDetail('Message','title','title',$scope);
	}
])

.controller('MessagesCreateCtrl',   [
                '$scope', 'Message',
	function (  $scope,   Message) {
		$scope.item = new Message()
		$scope.checkDate($scope.item)
	}
])

.controller('MessagesEditCtrl',   [
                '$scope', '$stateParams', '$state',
	function (  $scope,   $stateParams,   $state) {
		$scope.item = $scope.findById( $stateParams.itemId)
		$scope.item.tags=$scope.item.tags||[]
		$scope.checkDate($scope.item)
	}
])
