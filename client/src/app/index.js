angular.module('controllers',[
 'controllers.messages'
,'controllers.projects'
])
angular.module('resources', [
 'resources.messages'
,'resources.users'
,'resources.projects'
])

angular.module('app')
.config(['stateBuilderProvider', 
function (stateBuilderProvider) {
   stateBuilderProvider.statesFor('Message') 
   stateBuilderProvider.statesFor('Project')   			
}])


