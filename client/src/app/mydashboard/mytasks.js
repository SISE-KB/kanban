angular.module('controllers.mytasks', ['ui.router','ui.calendar','resources.tasks'])

.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('mytasks', {
    templateUrl:'views/mydashboard/list.tpl.html',
    controller:'MyDashboardCtrl',
  })
}])

.controller('MyDashboardCtrl', 
        ['$http','$scope','Task','globalData',
function ($http,  $scope,  Task , globalData) {
      function ini_events(ele) {
            ele.each(function() {

                // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
                // it doesn't need to have a start or end
                var eventObject = {
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
        ini_events($('#external-events div.external-event'));
      
      
    $scope.projects = globalData.devPrjs;
	Task.forUser(globalData.currentUser._id).then(function(ds){
			$scope.tasks = ds;
		    //$log.debug('load my tasks',ds);
	});
	       /* ADDING EVENTS */
        var currColor = "#f56954"; //Red by default
        //Color chooser button
        var colorChooser = $("#color-chooser-btn");
        $("#color-chooser > li > a").click(function(e) {
            e.preventDefault();
            //Save color
            currColor = $(this).css("color");
            //Add color effect to button
            colorChooser
                .css({
                    "background-color": currColor,
                    "border-color": currColor
                })
                .html($(this).text() + ' <span class="caret"></span>');
        });
        $("#add-new-event").click(function(e) {
            e.preventDefault();
            //Get value and make sure it is not null
            var val = $("#new-event").val();
            if (val.length == 0) {
                return;
            }

            //Create event
            var event = $("<div />");
            event.css({
                "background-color": currColor,
                "border-color": currColor,
                "color": "#fff"
            }).addClass("external-event");
            event.html(val);
            $('#external-events').prepend(event);

            //Add draggable funtionality
            ini_events(event);

            //Remove event from text input
            $("#new-event").val("");
        });
		
	 var date = new Date();
     var d = date.getDate(),
            m = date.getMonth(),
            y = date.getFullYear();

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
			 events: [{
                title: 'All Day Event',
                start: new Date(y, m, 1),
                backgroundColor: "#f56954", //red
                borderColor: "#f56954" //red
            }, {
                title: 'Long Event',
                start: new Date(y, m, d - 5),
                end: new Date(y, m, d - 2),
                backgroundColor: "#f39c12", //yellow
                borderColor: "#f39c12" //yellow
            }, {
                title: 'Meeting',
                start: new Date(y, m, d, 10, 30),
                allDay: false,
                backgroundColor: "#0073b7", //Blue
                borderColor: "#0073b7" //Blue
            },
			{
					id: 999,
					title: 'Repeating Event',
					start: '2015-06-08T10:00:00'
			},
			{
					id: 999,
					title: 'Repeating Event',
					start: '2015-06-15T10:00:00'
			}],
			editable: true,
            droppable: true, // this allows things to be dropped onto the calendar !!!
            eventLimit: true,
            drop: function(date, allDay) { // this function is called when something is dropped

                // retrieve the dropped element's stored Event Object
                var originalEventObject = $(this).data('eventObject');

                // we need to copy it, so that multiple events don't have a reference to the same object
                var copiedEventObject = $.extend({}, originalEventObject);

                // assign it the date that was reported
                copiedEventObject.start = date;
                copiedEventObject.allDay = allDay;
				copiedEventObject.textColor="#f00";
                copiedEventObject.backgroundColor = $(this).css("background-color");
                copiedEventObject.borderColor = $(this).css("border-color");

                // render the event on the calendar
                // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

                // is the "remove after drop" checkbox checked?
                if ($('#drop-remove').is(':checked')) {
                    // if so, remove the element from the "Draggable Events" list
                    $(this).remove();
                }

            }
		});	
	
}])

/*
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
