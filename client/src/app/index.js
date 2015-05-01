angular.module('controllers',[
 'controllers.messages'
,'controllers.users'
,'controllers.projects'
])
angular.module('resources', [
 'resources.messages'
,'resources.users'
,'resources.projects'
])

angular.module('app')
.value('SERVER_CFG',{URL:'http://127.0.0.1:3000'})
.config(['stateBuilderProvider', 
function (stateBuilderProvider) {
   stateBuilderProvider.statesFor('User') 
   stateBuilderProvider.statesFor('Message') 
   stateBuilderProvider.statesFor('Project')   			
}])




