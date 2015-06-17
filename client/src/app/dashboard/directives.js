angular.module('controllers.dashboard')  
.directive('projectCard', function () {
	return {
				restrict: 'E',
				replace:true,
				scope: {
				    mgrImage: '@',
					prjName: '@',
					items1: '=',
					items2: '=',
					items3: '=',
					items4: '='
				},
				templateUrl:'templates/prj-card.html'
	}
})
.directive('cardList', function () {
	return {
				restrict: 'E',
				replace:true,
				scope: {
					placement:"@",
					listTemplate:"@",
					items: '='
				},
				templateUrl:'templates/card-btn.html',
				controller: function ($scope) {
					//console.log($scope.placement,$scope.items)
				}
				 
	}
})
.run(["$templateCache", function($templateCache) {
	$templateCache.put("templates/card-btn.html",
	 '<button popover-placement="{{placement}}"' 
	 +'       popover-trigger="mouseenter" '
	 +'       popover-animation="true"'
     +'       popover-template="listTemplate" '
     +'       class="btn btn-default">{{items.length}}</button>'
	);
  $templateCache.put("templates/prj-card.html",
     "<div class='well'>"
   +"  <div class='row'>"	
   +" 		<div class='col-md-3'>"	
   +"       <img ng-src='uploads/{{mgrImage}}'  class='img-circle droplet-preview'>"
   +"     </div>"
   +" 		<div class='col-md-9' style='text-align: center;'>"
   +" 		<a ui-sref='projects.list'>{{prjName}}</a><br>"
   +"       BacklogsTODO:<card-list placement='bottom' list-template='templates/card-list.html' items='items1'> </card-list>"
   +"       BacklogsOK:<card-list placement='bottom' list-template='templates/card-list.html' items='items2'> </card-list>"
   +"       Task:<card-list placement='bottom' list-template='templates/card-list.html' items='items3'> </card-list>"
   +"       BUG:<card-list placement='bottom' list-template='templates/card-list.html' items='items4'> </card-list>"
   +" 		</div>"
   +"  </div>"
   +"</div>");
}]);
