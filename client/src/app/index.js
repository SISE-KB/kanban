angular.module('controllers',['controllers.messages'])
angular.module('resources', ['resources.messages','resources.users'])

angular.module('app')
.config(['stateBuilderProvider', 
function (stateBuilderProvider) {
   stateBuilderProvider.statesFor('Message')   			
}])


