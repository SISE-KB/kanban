angular.module('controllers.mytasks', ['ui.router','ui.calendar','resources.tasks','resources.myevents'])

.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('mytasks', {
    templateUrl:'views/mydashboard/list.tpl.html',
    controller:'MyDashboardCtrl',
  })
}])

.controller('MyDashboardCtrl', 
        ['$http','$scope','$timeout','Task','MyEvent','globalData',
function ($http,  $scope, $timeout,   Task , MyEvent, globalData) {
$scope.mytasks=[];
$scope.addMyEvent=function(){
	$scope.mytasks.push({
		title:$scope.newText

    });
	$timeout(ini_events, 2000);
}
    function ini_events() {
	  var ele=$('.external-events div.fc-event');
      ele.each(function() {
                var eventObject = {
                    title: $.trim($(this).text()) // use the element's text as the event title
                   
                };
                var cls=$(this).attr('class');
                console.log(cls);
                if(cls.indexOf("my")>=0) eventObject.type="me";
              // store the Event Object in the DOM element so we can get to it later
                $(this).data('eventObject', eventObject);
                // make the event draggable using jQuery UI
                $(this).draggable({
                    zIndex: 1070,
                    revert: true, // will cause the event to go back to its
                    revertDuration: 0 //  original position after the drag
                });
      });
   }
      
      
      
    $scope.projects = globalData.devPrjs;
	Task.forUser(globalData.currentUser._id).then(function(ds){
			$scope.tasks = ds;
			$timeout(ini_events, 2000);

	});
	function alertOnResize(e){
	  console.log(e);
	 }

     function mock(start,end,timezone, callback){
	// console.log(start);
	 var now=new Date();
      var d = now.getDate(),
      m = now.getMonth(),
      y = now.getFullYear(); 
     var	 es= [{
                title: 'All Day Event2',
                start: new Date(y, m, 1)
            }, {
                title: 'Long Event2',
                start: new Date(y, m, d - 3),
                end: new Date(y, m, d - 2)

            }, {
				id: 9999,
                title: 'Meeting2',
                start: new Date(y, m, d, 10, 30),
                allDay: true
            }];
			
	/*	for(var i=0;i<es.length;i++){
          var  obj=new MyEvent(es[i]);
		  obj.$save();
		}*/
		return 	callback(es);

}


	$('#calendar').fullCalendar({
		 lang: 'zh-cn',
		
eventSources: [{events:mock,
	   color: 'black',    // an option!
    textColor: 'yellow'  // an option!
},
  {
            url: '/db/myevents', // use the `url` property
              color: 'green',    // an option!
    textColor: 'red'  // an option!
      }
    ],
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
      
			editable: true,
            droppable: true, // this allows things to be dropped onto the calendar !!!
            eventLimit: true,
            eventResize: alertOnResize,
            eventDrop: function(event, delta, revertFunc,jsEvent) {
	
               //    alert(event.title + event.allDay + event.start.format()+ event.end.format());
                   console.log(event);
                  

            },
            drop: function(date, allDay) { // this function is called when something is dropped
                var originalEventObject = $(this).data('eventObject');
                var copiedEventObject = $.extend({}, originalEventObject);
                if(copiedEventObject.type&&"me"===copiedEventObject.type){
					delete copiedEventObject.type;
					copiedEventObject.color="black";
					copiedEventObject.textColor="yellow";
				}else{
				  copiedEventObject.color="green";
				  copiedEventObject.textColor="black";
			  }
                copiedEventObject.start = date;
          
                // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);
	

            }
		});	
	
}])

/*	 var date = new Date();
    ,
			{
					id: 999,
					title: 'Repeating Event',
					start: '2015-06-08T10:00:00'
			},
			{
					id: 999,
					title: 'Repeating Event',
					start: '2015-06-15T10:00:00'
			}]
	$scope.uiConfig = {
      calendar:{
        height: 700,
        editable: true,
        header:{
          left: 'prev today next',
          center: 'title',
          right: 'month agendaWeek agendaDay'
        },
		 buttonText: { //This is to add icons to the visible buttons
                prev: "前一个",
                next: "后一个",
                today: '今日',
                month: '月',
                week: '周',
                day: '天'
            },
	
			
        //dayClick: $scope.alertEventOnClick,
        //eventDrop: $scope.alertOnDrop,
        //eventResize: $scope.alertOnResize
*/
