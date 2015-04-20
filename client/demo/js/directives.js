'use strict';
 //   '  <p>{{msg.text | limitTo : limitLen }}</p>'+
angular.module('myApp')
.controller('NotifyController', ['$scope', '$attrs', function ($scope, $attrs) {
 // $scope.closeable = 'close' in $attrs;
  //this.close = $scope.close;
  $scope.limitLen=10;
}])

.directive('notify', function () {
  return {
    restrict:'E',
    controller:'NotifyController',
    template:'<div class="col-md-4">'+
              '  <h2>{{msg.title}}</h2>'+
              ' <div marked="msg.text "></div>'+
           //   ' <p ><button type="submit" class="btn btn-success" ng-click="limitLen=limitLen==10?100:10">更多信息 &raquo;</button></p>'+
              '</div>',
    transclude:false,
    replace:true,
    scope: {
      msg: '='
    }
  };
})
