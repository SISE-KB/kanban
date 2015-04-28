(function() {

  function stateBuilderProvider($stateProvider) {

    // This $get noop is because at the moment in AngularJS "providers" must provide something
    // via a $get method.
    // When AngularJS has "provider helpers" then this will go away!
    this.$get = angular.noop
	this.statesFor=function(Res){
		var Ress   = Res+'s'
			,resName=Ress.toLowerCase()
		//this.$inject = [Res]
		/*var resoFn={}
		resoFn[resName]=	[Res,
			function( Res){
				return Res.all()
		}]*/
		
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
				controller:  'MessagesListCtrl'
			})
			.state(resName+'.create', {
					url: '/create',
					templateUrl: 'views/'+resName+'/edit.tpl.html',
					controller:  Ress+'CreateCtrl'
			})
			.state(resName+'.list.detail', {
				url: '/:itemId',
				templateUrl: 'views/'+resName+'/detail.tpl.html',
				controller:  Ress+'DetailCtrl'
		/*		views:{
					'detail@':	{
						templateUrl: 'views/'+resName+'/detail.tpl.html',
						controller:  Ress+'DetailCtrl'
					}	
				}*/
			})
			.state(resName+'.edit', {
				url: '/:itemId/edit',
				templateUrl: 'views/'+resName+'/edit.tpl.html',
				controller:  Ress+'EditCtrl'
			})
		}//stateFor


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

   }//stateBuilderProvider

    stateBuilderProvider.$inject = ['$stateProvider']
    angular.module('services.stateBuilderProvider', ['ui.router'])
		.provider('stateBuilder', stateBuilderProvider)
})()
