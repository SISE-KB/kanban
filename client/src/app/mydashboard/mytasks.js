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
    $scope.projects = globalData.devPrjs;
	Task.forUser(globalData.currentUser._id).then(function(ds){
			$scope.tasks = ds;
		    //$log.debug('load my tasks',ds);
	});

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
			editable: true,
            droppable: true, // this allows things to be dropped onto the calendar !!!
            drop: function(date, allDay) {
			  console.log(date,allDay);
			},
			eventLimit: true // allow "more" link when too many events
			
        //dayClick: $scope.alertEventOnClick,
        //eventDrop: $scope.alertOnDrop,
        //eventResize: $scope.alertOnResize
      }
    };
	 var date = new Date();
     var d = date.getDate(),
            m = date.getMonth(),
            y = date.getFullYear();
	$scope.uiConfig.calendar.events= [
			{
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
			}];
	
}])
