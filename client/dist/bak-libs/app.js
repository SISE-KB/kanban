   angular.module('myApp', ['ng-sortable'])
    .controller('demo', ['$scope', function ($scope) {
		
         $scope.items1 = [
			 {name:'游戏场景',text: '障碍的移动叠加',catalog:'功能',projectId:'1',priority:'1',estimation:'10',state:'todo'},
			 {name:'开始场景',text: '保存数据的叠加',catalog:'功能',projectId:'1',priority:'3',estimation:'5',state:'todo'}
			 ];
		$scope.items2 = [
		{name:'计时器',text: '进行游戏时进行计时',catalog:'功能',projectId:'1',priority:'1',estimation:'6',state:'doing'}
		];
		$scope.items3 = [
		{name:'选关界面',text: '点击可以切换场景',catalog:'功能',projectId:'1',priority:'2',estimation:'4',state:'done'}
		]; 
		 
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
			$scope.addTodo = function () {
				$scope.items1.push({name:$scope.todoName,text: $scope.todoText,
										catalog:$scope.todoCatalog,projectId :$scope.todoProjectId,
										priority:$scope.todoPriority,estimation:$scope.todoEstimation,
										state:'todo'});
				$scope.todoName = '';
			};

			
		}]);

