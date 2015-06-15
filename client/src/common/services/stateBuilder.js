(function() {
	function stateBuilderProvider($stateProvider,securityAuthorizationProvider) {
		this.$get = angular.noop
		this.statesFor=function(Res){
			var Ress   = Res+'s'
			,resName=Ress.toLowerCase()
		
			$stateProvider
			.state(resName, {
				abstract: true,
				url: "/"+resName,
				templateUrl: 'views/'+resName+'/index.tpl.html',
				//resolve: resoFn,
				controller: Ress+'MainCtrl'
			})

			.state(resName+'.list', {
				url: '',//default
				templateUrl: 'views/'+resName+'/list.tpl.html',
				controller:  Ress+'ListCtrl'
			})
			.state(resName+'.create', {
					url: '/create',
					templateUrl: 'views/'+resName+'/edit.tpl.html',
					controller:  Ress+'CreateCtrl'
			})
			.state(resName+'.detail', {
				url: '/:itemId',
				templateUrl: 'views/'+resName+'/detail.tpl.html',
				controller:  Ress+'DetailCtrl'
			})
			.state(resName+'.edit', {
				url: '/:itemId/edit',
				templateUrl: 'views/'+resName+'/edit.tpl.html',
				controller:  Ress+'EditCtrl',
				resolve: {
	              currentUser: securityAuthorizationProvider.requireAuthenticatedUser
	            }
			})
		}//stateFor

   }//stateBuilderProvider

    stateBuilderProvider.$inject = ['$stateProvider','securityAuthorizationProvider']
    angular.module('services.stateBuilderProvider', ['ui.router','security.authorization'])
		.provider('stateBuilder', stateBuilderProvider)
})()
