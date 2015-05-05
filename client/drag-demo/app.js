  angular.module('myApp', ['ng-sortable'])
    .controller('demo', ['$scope', function ($scope) {
        $scope.items1 = [
		      {name:'1',img:'face-01.jpg',state:'TODO'}
             ,{name:'2',img:'face-02.jpg',state:'TODO'}
             ,{name:'3',img:'face-03.jpg',state:'TODO'}
			 ,{name:'4',img:'face-04.jpg',state:'TODO'}
			 ,{name:'5',img:'face-05.jpg',state:'TODO'}
			 ];
		$scope.items2 = [];
		$scope.items3 = [];
		/*
		$scope.allConfig={
		   draggable: '.tile',
		   handle: '.tileName'
	    };*/
        $scope.todoConfig = {
		    animation: 150,
            group: {name:'todo',put: false},
			 onRemove:function(data){
			   console.log("onRemove--",data.model,data.oldIndex)
			}
			
        };
		$scope.doingConfig = {
			animation: 300,
             group: {name:'doing', put: ['todo']},
			 onAdd:function(data){
			   data.model.state="DOING";
			}
		};
		$scope.doneConfig = {
			animation: 1000,
            group: {name:'done',put: ['todo','doing']},
			onAdd:function(data){
			   data.model.state="DONE";
			   console.log("onAdd--",data.model,data.newIndex)
			}
		};
	
    }])
	.controller('TodoController', ['$scope', function ($scope) {
			$scope.todos = [
				{text: 'learn angular', done: true},
				{text: 'build an angular app', done: false}
			];

			$scope.addTodo = function () {
				$scope.todos.push({text: $scope.todoText, done: false});
				$scope.todoText = '';
			};

			$scope.remaining = function () {
				var count = 0;
				angular.forEach($scope.todos, function (todo) {
					count += todo.done ? 0 : 1;
				});
				return count;
			};

			$scope.archive = function () {
				var oldTodos = $scope.todos;
				$scope.todos = [];
				angular.forEach(oldTodos, function (todo) {
					if (!todo.done) $scope.todos.push(todo);
				});
			};
			/*
			$scope.sortableConfig = { group: 'todo', animation: 150 };
			'Start End Add Update Remove Sort'.split(' ').forEach(function (name) {
				$scope.sortableConfig['on' + name] = console.log.bind(console, name);
			});*/
		}]);