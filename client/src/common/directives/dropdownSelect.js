angular.module('directives.dropdownSelect', [])
.directive('dropdownSelect', function () {
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
							"<span class='btn btn-small'>{{nameById(ngModel)}}</span>" +
							"<button class='btn btn-small dropdown-toggle' data-ng-click='openDropdown($event)'><span class='caret'></span></button>" +
							"<ul class='dropdown-menu' aria-labelledby='dropdownMenu'>" +
							   "<li data-ng-repeat='option in options'><a data-ng-click='toggleSelectItem(option)'><span data-ng-class='getClassName(option)' aria-hidden='true'></span>"+
                                "{{!id?option:option[''+name]}}</a></li>" +
							"</ul>" +
						"</div>",

				controller: function ($scope) {
					$scope.nameById = function (key) {
					    if(!$scope.id) return key;
						for(var i=0;i<$scope.options.length;i++){
							var item=$scope.options[i];
						     if(item[''+$scope.id]==key){
						      return item[''+$scope.name]
						   }
						}
						return '?';						
					};
					$scope.openDropdown = function ($event) {
						$scope.open = !$scope.open;
						$event.stopPropagation();
					};

			
					$scope.toggleSelectItem = function (option) {
						if(!$scope.id) 
						   $scope.ngModel=option;
						else
						   $scope.ngModel=option[''+$scope.id];
					};

					$scope.getClassName = function (option) {
						//$scope.ngModel =$scope.ngModel ||[]
						var varClassName = 'glyphicon glyphicon-remove red';
						var item=$scope.ngModel
						if (item == option||item == option[$scope.id]) {
								varClassName = 'glyphicon glyphicon-ok green';
						}
						return (varClassName);
					};
				}
	}

});
