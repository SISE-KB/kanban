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
.value('SERVER_CFG',{URL:'http://172.16.28.188:3000'})
.config(['stateBuilderProvider', 
function (stateBuilderProvider) {
   stateBuilderProvider.statesFor('Message') 
   stateBuilderProvider.statesFor('Project')   			
}])




