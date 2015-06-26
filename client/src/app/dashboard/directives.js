
angular.module('controllers.dashboard')  
.directive('projectCard', function () {
	return {
				restrict: 'E',
				replace:true,
				scope: {
				    mgrImage: '@',
					prjName: '@',
					id: '@_id',
					items1: '=',
					items2: '=',
					items3: '=',
					items4: '=',
					tasks: '=',
					issues: '='
				},
				templateUrl:'views/dashboard/prj-card.tpl.html'
				

	}
})
.directive('itemList', function () {
	return {
				restrict: 'E',
				replace:true,
				scope: {
					placement:"@",
					listTemplate:"@",
					pic: '@',
					items: '='
				},
				templateUrl:'views/dashboard/item-btn.tpl.html'
				 
	}
})
.directive('backlogList', function () {
	return {
				restrict: 'E',
				replace:true,
				scope: {
					listTemplate:"@",
					items1: '=',
					items2: '=',
					items3: '=',
					items4: '=',
				},
				templateUrl:'views/dashboard/backlog-btn.tpl.html',
				controller: function ($scope) {
					console.log($scope.items2);
					var makeConfig =function(state) {
			            return {
				          animation: 150,
				          group: {name : state}
				       };
                   };
		
				$scope.todoConfig=makeConfig('TODO');
				$scope.doingConfig=makeConfig('DOING');
				$scope.doneConfig=makeConfig('DONE');  
				$scope.okConfig=makeConfig('OK');
			}
				 
	}
})
