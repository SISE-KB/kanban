angular.module('states.messages', ['ui.router'
, 'resources.messages',
, 'controllers.messages'])  
.config([
              '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
		var Res = "Message"
		, Ress   = Res+'s'
		,resName=(Ress).toLowerCase()
		this.$inject = [Res]
		var resoFn={}
		resoFn[resName]=	[Res,
			function( Res){
				return Res.all()
		}]
		$stateProvider
			.state(resName, {
				abstract: true,
				url: "/"+resName,
				templateUrl: 'views/'+resName+'/index.tpl.html',
				resolve: resoFn,
				controller: Ress+'MainCtrl'
			})

            // Using a '.' within a state name declares a child within a parent.
			// So you have a new state 'list' within the parent 'messages' state.
			.state(resName+'.list', {
				url: '',//default
				templateUrl: 'views/'+resName+'/list.tpl.html',
				controller:  'MessagesListCtrl'
			})
			.state(resName+'.create', {
					url: '/crete',
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
				controller:  Ress+'EditCtrl'
				
			})

		/*	
		var temp={};
		temp['"@'+resName+'"']= { 
			templateUrl: 'views/'+resName+'/edit.tpl.html',
			controller: Ress+'EditCtrl'
		}
		var editViews={url: '/:itemId/edit',views:{}}
		angular.extend(editViews.views,temp)
	
		$stateProvider	
			.state(resName+'.edit', editViews)
*/
    }
])
