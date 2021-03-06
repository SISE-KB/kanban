angular.module('directives.dropdownMultiselect', [])
.directive('dropdownMultiselect', function () {
	return {
				restrict: 'E',
				scope: {
				    id: '@',
					name: '@',
					ngModel: '=',
					options: '='
				},
				template:
						"<div class='btn-group' data-ng-class='{open: open}'>" +
							"<button class='btn btn-small'>请选择...</button>" +
							"<button class='btn btn-small dropdown-toggle' data-ng-click='openDropdown($event)'><span class='caret'></span></button>" +
							"<ul class='dropdown-menu' aria-labelledby='dropdownMenu'>" +
								"<li><a data-ng-click='selectAll()'><span class='glyphicon glyphicon-ok green' aria-hidden='true'></span>全部选中</a></li>" +
								"<li><a data-ng-click='deselectAll();'><span class='glyphicon glyphicon-remove red' aria-hidden='true'></span>全部取消</a></li>" +
								"<li class='divider'></li>" +
								"<li data-ng-repeat='option in options'><a data-ng-click='toggleSelectItem(option)'><span data-ng-class='getClassName(option)' aria-hidden='true'></span>"+
                                "{{!id?option:option[''+name]}}</a></li>" +
							"</ul>" +
							"<span data-ng-repeat='key in ngModel'>{{nameById(key)}}{{' '}}</span>"+
						"</div>",

				controller: function ($scope) {
					$scope.nameById = function (key) {
					    if(!$scope.id) return key;
						for(var i=0;i<$scope.options.length;i++){
							var item=$scope.options[i];
						     if(item[''+$scope.id]==key){
						       //console.log("OK",item[''+$scope.name]);
						      return item[''+$scope.name]
						   }
						}
						//console.log("FAIL");
						return '?';						
					};
					$scope.openDropdown = function ($event) {
						$scope.open = !$scope.open;
						$event.stopPropagation();
					};

					$scope.selectAll = function () {
						$scope.ngModel = [];
						angular.forEach($scope.options, function (item, index) {
						if(!$scope.id)
						   $scope.ngModel.push(item);
						else   
						   $scope.ngModel.push(item[$scope.id]);

						});
					};

					$scope.deselectAll = function () {
						$scope.ngModel = [];
					};
				

					$scope.toggleSelectItem = function (option) {
						var intIndex = -1;
						$scope.ngModel=$scope.ngModel||[];
						angular.forEach($scope.ngModel, function (item, index) {
							if (item == option|| item ==option[$scope.id]) {
								intIndex = index;
							}
						});
						//console.log('intIndex',intIndex);

						if (intIndex >= 0) {
							$scope.ngModel.splice(intIndex, 1);
						}
						else {
						   if(!$scope.id)
						      $scope.ngModel.push(option);
						   else
							 $scope.ngModel.push(option[$scope.id]);

						}
						
						//console.log($scope.ngModel);

					};

					$scope.getClassName = function (option) {
						//$scope.ngModel =$scope.ngModel ||[]
						var varClassName = 'glyphicon glyphicon-remove red';
						angular.forEach($scope.ngModel, function (item, index) {
							if (item == option||item == option[$scope.id]) {
								varClassName = 'glyphicon glyphicon-ok green';
							}
						});
						//console.log(option,varClassName);
						return (varClassName);
					};
				}
	}

});
