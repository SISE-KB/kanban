angular.module('controllers.mytasks', ['ui.router','ui.calendar','resources.tasks','resources.myevents'])
.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('userTasks',{
		   url: "/userTasks/:userId",
		   templateUrl:'views/mytasks/userTaskList.tpl.html',
           controller:'userTasksCtrl'
	});
   $stateProvider.state('mytasks', {
    templateUrl:'views/mytasks/list.tpl.html',
    controller:'MyDashboardCtrl'
  });
}])
.controller('userTasksCtrl', 
                        ['$scope','$http','$log','globalData',
    function ( $scope,$http,$log,globalData) {
	 // $log.debug('$stateParams:',$scope.$stateParams);
	  $scope.user=globalData.exchangeData;
	  $http.post('/api/users/loadTasks' ,{userId:$scope.user._id} )
		               .then(function(resp){
		                     var data=resp.data;
	 	                     $log.debug('return tasks:',data);
	 	                      $scope.tasks=data;
		                     //return data;
		                });    
	/*  $scope.tasks=[
	        {name:'T1',state:'TODO'}
		  ,{name:'T2',state:'OK'} 
	  ];*/
      
}])  
.controller('ModalInstanceCtrl', [
               '$scope', '$log','$modalInstance','globalData',
    function ($scope,    $log,  $modalInstance,   globalData) {
	$scope.item=globalData.exchange;
	$scope.save = function () {

		if($scope.item) {
			$log.debug('UPDTATE:',$scope.item);
			$scope.item.$update();
		}
		$modalInstance.close(true);
	};

	$scope.cancel = function () {
		$modalInstance.close(false);//dismiss('cancel');
	};
}])

.controller('MyDashboardCtrl', 
        ['$http','$q','$log','$scope','$timeout','$modal','Task','MyEvent','security','globalData',
function ($http,  $q, $log, $scope,$timeout,$modal,  Task , MyEvent, security,globalData) {
	var curUserId=security.currentUser.id;
    var dialog=null;
    
    $scope.mytasks=[];
    
    function onDialogClose(success) {
	//	$log.debug('onDialogClose',success);
		dialog = null;
		return success;
	}
    function onResize(event){
		event.$update();
	}

	function loadData(start,end,timezone, callback){
		MyEvent.load(curUserId).then(function(es){
			var rt=[];
			for( var i=0;i<es.length;i++){
				var e=es[i];
				var d=new Date(e.start)
				   ,d1=new Date(start._d)
				   ,d2=new Date(end._d);
				
				d=d.getTime();d1=d1.getTime();d2=d2.getTime();
				if(d>=d1&&d<=d2)
				   rt.push(e);
			}
			callback(rt);
		});
	}
	$scope.edit = function (item) {
		globalData.exchange=item;
		dialog = $modal.open({ templateUrl:'views/mytasks/edit.tpl.html'
					              , controller: 'ModalInstanceCtrl'});
		return  dialog.result.then(onDialogClose);
	};
		
	$scope.addMyEvent=function(){
		$scope.mytasks.push({title:$scope.newText});
	}

	Task.forUser(curUserId).then(function(ds){
			$scope.tasks = ds;
	});

	
	$('#calendar').fullCalendar({
		lang: 'zh-cn',
		businessHours:{
			start: '9:00', // a start time (10am in this example)
			end: '18:00', // an end time (6pm in this example)
            dow: [ 1, 2, 3, 4,5 ]
		},
		eventSources: [
			{events:loadData, color: 'black',textColor: 'yellow' }
		],
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
      
		editable: true,
        droppable: true, // this allows things to be dropped onto the calendar !!!
        eventLimit: true,
        eventResize: onResize,
        eventDrop: function(event, delta, revertFunc,jsEvent) {
	        event.$update();
        },
        eventClick: function(event, element) {
			$scope.edit(event).then(function(){
				 $('#calendar').fullCalendar('updateEvent', event);
			});
		},
        drop: function(date, allDay) { // this function is called when something is dropped
     //JSON.parse( 
            var eventObject =$(this).data('event') ;
     
            var cls=$(this).attr('class');
     $log.debug(eventObject);
           
          //  var copiedEventObject = $.extend({}, originalEventObject);
            eventObject.start = date;
            if(cls.indexOf("my")>=0){
				eventObject.color="black";
				eventObject.textColor="white";
			}else{
				eventObject.color="yellow";
				eventObject.textColor="red";
			 }
               eventObject.userId=curUserId;
              // console.log('curUserId',curUserId);
              var  obj=new MyEvent(eventObject);
              obj.$save(); 
              $('#calendar').fullCalendar('renderEvent', obj, false);
              $(this).remove();
	  }
   });	
}])


