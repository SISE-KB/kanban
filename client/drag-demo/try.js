  angular.module('myApp', ['ui.bootstrap','directives.ProjectCard'])
    .controller('demo', ['$scope', function ($scope) {
       $scope.items1 = [
		      {name:'1', effort:9}
             ,{name:'2',effort:9}
             ,{name:'3',effort:12}
			 ,{name:'4',effort:4}
			 ,{name:'5',effort:8}
		 ];
       $scope.items2 = [
		      {name:'6',effort:9}
             ,{name:'7',effort:9}
        ];
         $scope.items3 = [
		      {name:'8',effort:9}
             ,{name:'9',effort:9}
        ];
	
    }])
	
