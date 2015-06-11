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

    function ini_events() {
	  var ele=$('#external-events div.fc-event');
            ele.each(function() {
                var eventObject = {
				   // backgroundColor:$scope.currColor,
                    title: $.trim($(this).text()) // use the element's text as the event title
                };

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

     function mock(start,end){
	 console.log(start);
	 var now=new Date();
      var d = now.getDate(),
      m = now.getMonth(),
      y = now.getFullYear(); 
     var	 es= [{
                title: 'All Day Event',
                start: new Date(y, m, 1)
                //backgroundColor: "#f56954",  borderColor: "#f56954" 
            }, {
                title: 'Long Event',
                start: new Date(y, m, d - 3),
                end: new Date(y, m, d - 2)
               // backgroundColor: "#f39c12", //yellow

            }, {
                title: 'Meeting',
                start: new Date(y, m, d, 10, 30),
                allDay: false
                //backgroundColor: "#0073b7", 

            }];
			
		for(var i=0;i<es.length;i++){
          var  obj=new MyEvent(events[i]);
		  obj.$save();
		}	

}

	$('#calendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            buttonText: { //This is to add icons to the visible buttons
                prev: "《",
                next: "》",
                today: 'today',
                month: '月',
                week: '周',
                day: '日'
            },
			editable: true,
            droppable: true, // this allows things to be dropped onto the calendar !!!
            eventLimit: true,
            drop: function(date, allDay) { // this function is called when something is dropped
                var originalEventObject = $(this).data('eventObject');
                var copiedEventObject = $.extend({}, originalEventObject);

                // assign it the date that was reported
                copiedEventObject.start = date;
                copiedEventObject.allDay = true;
				copiedEventObject.textColor="#000";
                //copiedEventObject.backgroundColor = $(this).css("background-color");
                //copiedEventObject.borderColor = $(this).css("border-color");

                // render the event on the calendar
                // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                $('#calendar').fullCalendar('renderEvent', copiedEventObject, false);
				mock(date,date);

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
