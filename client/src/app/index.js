angular.module('controllers',[
 'controllers.messages'
,'controllers.users'
,'controllers.projects'
,'controllers.backlogs'
,'controllers.sprints'
,'controllers.issues'
,'controllers.dashboard'
,'controllers.mytasks'
])
angular.module('resources', [
 'resources.messages'
,'resources.users'
,'resources.projects'
,'resources.backlogs'
,'resources.issues'
,'resources.tasks'
,'resources.myevents'
])

angular.module('app')
.value('SERVER_CFG',{URL:'http://127.0.0.1:3000'})
.config(['stateBuilderProvider', 
function (stateBuilderProvider) {
   stateBuilderProvider.statesFor('User') 
   stateBuilderProvider.statesFor('Project')   	
   stateBuilderProvider.statesFor('Issue') 	
   stateBuilderProvider.statesFor('Message') 	
}])
.config(['uiSelectConfig', function(uiSelectConfig) {
  uiSelectConfig.theme = 'bootstrap';
}])




