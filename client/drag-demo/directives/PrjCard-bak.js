angular.module('directives.ProjectCard', [])
.directive('cardList', function () {
	return {
				restrict: 'E',
				replace:true,
				scope: {
				    //placement: '@',
				   // template: '@',
				    items: '='
				},
				templateUrl:'templates/card-btn.html',
				controller: function ($scope) {
				  console.log($scope.items);
				} 
				
	}
})
.directive('projectCard', function () {
	return {
				restrict: 'E',
				replace:true,
				scope: {
				    mgrImage: '@',
					prjName: '@',
					items1: '=',
					items2: '='
				},
				templateUrl:'templates/prj-card.html'
	}
})
.run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/card-list.html",
     "<div class='well'>"
   +"   <ul>"
   +"     <li ng-repeat='item in items'>{{item.name}}</li>"
   +"   </ul>"
   +"</div>");
  $templateCache.put("templates/card-btn.html",
			  '<button popover-placement="bottom" '
			 +'  popover="popover template">{{items.length}}</button>'
	);
  $templateCache.put("templates/prj-card.html",
     "<div class='well'>"
   +"   <img ng-src='images/{{mgrImage}}'  class='img-circle'>"
   +"    {{items1.length}}/{{items2.length}}"
//   +"   <project-card-list> items='items2' placement='\"bottom\"' template='\"templates/prj-card-list.html\"'></project-card-list>"
   +"</div>");
}]);
