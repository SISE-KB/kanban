angular.module('directives.dropdownMultiselect', [])
.directive('dropdownMultiselect', function () {
	return {
				restrict: 'E',
				scope: {
				    id: '@',
					name: '@',
					ngModel: '=',
					options: '='
				},
				template:
						"<div class='btn-group' data-ng-class='{open: open}'>" +
							"<button class='btn btn-small'>请选择...</button>" +
							"<button class='btn btn-small dropdown-toggle' data-ng-click='openDropdown($event)'><span class='caret'></span></button>" +
							"<ul class='dropdown-menu' aria-labelledby='dropdownMenu'>" +
								"<li><a data-ng-click='selectAll()'><span class='glyphicon glyphicon-ok green' aria-hidden='true'></span>全部选中</a></li>" +
								"<li><a data-ng-click='deselectAll();'><span class='glyphicon glyphicon-remove red' aria-hidden='true'></span>全部取消</a></li>" +
								"<li class='divider'></li>" +
								"<li data-ng-repeat='option in options'><a data-ng-click='toggleSelectItem(option)'><span data-ng-class='getClassName(option)' aria-hidden='true'></span>"+
                                "{{!id?option:option[''+name]}}</a></li>" +
							"</ul>" +
							"<span data-ng-repeat='key in ngModel'>{{nameById(key)}}{{' '}}</span>"+
						"</div>",

				controller: function ($scope) {
					$scope.nameById = function (key) {
					    if(!$scope.id) return key;
						for(var i=0;i<$scope.options.length;i++){
							var item=$scope.options[i];
						     if(item[''+$scope.id]==key){
						       //console.log("OK",item[''+$scope.name]);
						      return item[''+$scope.name]
						   }
						}
						//console.log("FAIL");
						return '?';						
					};
					$scope.openDropdown = function ($event) {
						$scope.open = !$scope.open;
						$event.stopPropagation();
					};

					$scope.selectAll = function () {
						$scope.ngModel = [];
						angular.forEach($scope.options, function (item, index) {
						if(!$scope.id)
						   $scope.ngModel.push(item);
						else   
						   $scope.ngModel.push(item[$scope.id]);

						});
					};

					$scope.deselectAll = function () {
						$scope.ngModel = [];
					};
				

					$scope.toggleSelectItem = function (option) {
						var intIndex = -1;
						$scope.ngModel=$scope.ngModel||[];
						angular.forEach($scope.ngModel, function (item, index) {
							if (item == option|| item ==option[$scope.id]) {
								intIndex = index;
							}
						});
						//console.log('intIndex',intIndex);

						if (intIndex >= 0) {
							$scope.ngModel.splice(intIndex, 1);
						}
						else {
						   if(!$scope.id)
						      $scope.ngModel.push(option);
						   else
							 $scope.ngModel.push(option[$scope.id]);

						}
						
						//console.log($scope.ngModel);

					};

					$scope.getClassName = function (option) {
						//$scope.ngModel =$scope.ngModel ||[]
						var varClassName = 'glyphicon glyphicon-remove red';
						angular.forEach($scope.ngModel, function (item, index) {
							if (item == option||item == option[$scope.id]) {
								varClassName = 'glyphicon glyphicon-ok green';
							}
						});
						//console.log(option,varClassName);
						return (varClassName);
					};
				}
	}

});

angular.module('directives.dropdownSelect', [])
.directive('dropdownSelect', function () {
	return {
				restrict: 'E',
				scope: {
				    id: '@',
					name: '@',
					ngModel: '=',
					options: '='
				},
				template:
						"<div class='btn-group' data-ng-class='{open: open}'>" +
							"<span class='btn btn-small'>{{nameById(ngModel)}}</span>" +
							"<button class='btn btn-small dropdown-toggle' data-ng-click='openDropdown($event)'><span class='caret'></span></button>" +
							"<ul class='dropdown-menu' aria-labelledby='dropdownMenu'>" +
							   "<li data-ng-repeat='option in options'><a data-ng-click='toggleSelectItem(option)'><span data-ng-class='getClassName(option)' aria-hidden='true'></span>"+
                                "{{!id?option:option[''+name]}}</a></li>" +
							"</ul>" +
						"</div>",

				controller: function ($scope) {
					$scope.nameById = function (key) {
					    if(!$scope.id) return key;
						for(var i=0;i<$scope.options.length;i++){
							var item=$scope.options[i];
						     if(item[''+$scope.id]==key){
						      return item[''+$scope.name]
						   }
						}
						return '?';						
					};
					$scope.openDropdown = function ($event) {
						$scope.open = !$scope.open;
						$event.stopPropagation();
					};

			
					$scope.toggleSelectItem = function (option) {
						if(!$scope.id) 
						   $scope.ngModel=option;
						else
						   $scope.ngModel=option[''+$scope.id];
					};

					$scope.getClassName = function (option) {
						//$scope.ngModel =$scope.ngModel ||[]
						var varClassName = 'glyphicon glyphicon-remove red';
						var item=$scope.ngModel
						if (item == option||item == option[$scope.id]) {
								varClassName = 'glyphicon glyphicon-ok green';
						}
						return (varClassName);
					};
				}
	}

});

angular.module('filters', [])
.filter('trim', function($filter){
	var limitToFilter =$filter('limitTo');
	return function(input, limit) {
		if (input.length > limit) {
			return limitToFilter(input, limit-3) + '...';
         }
        return input;
    };
});

angular.module('security.authorization', ['security.service'])
.provider('securityAuthorization', {
  requireAdminUser: ['securityAuthorization', function(securityAuthorization) {
    return securityAuthorization.requireAdminUser()
  }],
 /*  getMyDevProjects: ['securityAuthorization', function(securityAuthorization) {
     return securityAuthorization.getMyDevProjects()
   }],
   getMyPrdMgrPrjs: ['securityAuthorization', function(securityAuthorization) {
     return securityAuthorization.getMyPrdMgrPrjs()
   }],*/
  requireAuthenticatedUser: ['securityAuthorization', function(securityAuthorization) {
    return securityAuthorization.requireAuthenticatedUser()
  }],

  $get: [  '$http', 'security', 'securityRetryQueue','SERVER_CFG','globalData',
    function($http,  security,   queue,               SERVER_CFG,globalData) {
    var service = {
	/*  getMyPrdMgrPrjs: function() {
		var userId= !security.currentUser ? '':security.currentUser.id;
		var req= SERVER_CFG.URL+'/api/projects/mgrby';
		console.log("myPrdMgrPrjs",req);
		var p=$http.post(req,{userId:userId}).then(function(response) {
		    //console.log("/api/projects/mgrby",response.data);
            return response.data;
        });
        return p;
			  
      },
	  getMyDevProjects: function() {
		var userId= !security.currentUser ? '':security.currentUser.id;
		var req= SERVER_CFG.URL+'/api/projects/devby';
		console.log("getMyDevProjects",req);
		var p=$http.post(req,{userId:userId}).then(function(response) {
		    //console.log("/api/projects/foruser",response.data);
            return response.data;
        });
        return p;
			  
      },*/
      requireAuthenticatedUser: function() {
        var promise = security.requestCurrentUser().then(function(userInfo) {
			console.log('requireAuthenticatedUser： return：',userInfo)
          if ( !security.isAuthenticated() ) {
		     console.log('unauthenticated-client！ push requireAuthenticatedUser again' )
            return queue.pushRetryFn('unauthenticated-client', service.requireAuthenticatedUser)
          } else{
			globalData.setCurrentUser(security.currentUser);  
		    return security.currentUser;
		  }
        });
        return promise
      },

      // Require that there is an administrator logged in
      // (use this in a route resolve to prevent non-administrators from entering that route)
      requireAdminUser: function() {
        var promise = security.requestCurrentUser().then(function(userInfo) {
		console.log('requireAdminUser',userInfo)
          if ( !security.isAdmin() ) {
            return queue.pushRetryFn('unauthorized-client', service.requireAdminUser)
          }else{
			  globalData.setCurrentUser(security.currentUser);  
		    return security.currentUser
		  }
        });
        return promise
      }

    }

    return service
  }]
})

// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
angular.module('security', [
  'security.service',
  'security.interceptor',
  'security.login',
  'security.authorization']);

angular.module('security.interceptor', ['security.retryQueue'])

// This http interceptor listens for authentication failures
.factory('securityInterceptor', ['$injector', '$q', 'securityRetryQueue', function($injector, $q, queue) {
  return {
    responseError: function(originalResponse) {
      if(originalResponse.status === 401) {
        // The request bounced because it was not authorized - add a new request to the retry queue
        return queue.pushRetryFn('unauthorized-server', function retryRequest() {
          // We must use $injector to get the $http service to prevent circular dependency
          return $injector.get('$http')(originalResponse.config);
        });
      }
      return $q.reject(originalResponse);
    }
  };
}])

// We have to add the interceptor to the queue as a string because the interceptor depends upon service instances that are not available in the config block.
.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('securityInterceptor');
}]);
angular.module('security.retryQueue', [])

// This is a generic retry queue for security failures.  Each item is expected to expose two functions: retry and cancel.
.factory('securityRetryQueue', ['$q', '$log', function($q, $log) {
  var retryQueue = []
  var service = {
    // The security service puts its own handler in here!
    onItemAddedCallbacks: [],
    
    hasMore: function() {
      return retryQueue.length > 0
    },
    push: function(retryItem) {
      retryQueue.push(retryItem)
      // 可以插入自己的处理代码。比如显示登录对话框等
      angular.forEach(service.onItemAddedCallbacks, function(cb) {
        try {
          cb(retryItem)
        } catch(e) {
          $log.error('securityRetryQueue.push(retryItem): callback threw an error' + e)
        }
      });
    },
    pushRetryFn: function(reason, retryFn) {
      // The reason parameter is optional
      if ( arguments.length === 1) {
        retryFn = reason
        reason = undefined
      }

      // The deferred object that will be resolved or rejected by calling retry or cancel
      var deferred = $q.defer();
      var retryItem = {
        reason: reason,
        retry: function() {
          // Wrap the result of the retryFn into a promise if it is not already
          $q.when(retryFn()).then(function(value) {
            // If it was successful then resolve our deferred
			console.log('retryFn()',value)
            deferred.resolve(value)
          }, function(value) {
            // Othewise reject it
            deferred.reject(value)
          })
        },
        cancel: function() {
          // Give up on retrying and reject our deferred
          deferred.reject()
        }
      };
      service.push(retryItem)
      return deferred.promise
    },
    retryReason: function() {
      return service.hasMore() && retryQueue[0].reason
    },
    cancelAll: function() {
      while(service.hasMore()) {
        retryQueue.shift().cancel()
      }
    },
    retryAll: function() {
      while(service.hasMore()) {
        retryQueue.shift().retry()
      }
    }
  };
  return service
}])

// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
angular.module('security.service', [
  'security.retryQueue',    // Keeps track of failed requests that need to be retried once the user logs in
  'security.login',         // Contains the login form template and controller
  'ui.bootstrap.modal'     // Used to display the login form as a modal dialog.
])

.factory('security', [
       '$http', '$q', '$state', 'securityRetryQueue', '$modal', '$rootScope','$injector',
function($http, $q, $state, queue, $modal,$rootScope,$injector) {

  // Redirect to the given url (defaults to '/')
  function redirect(state) {
    state = state || 'dashboard';
    console.log("redirect to:",state);
    $state.go(state);
  }

  // Login form dialog stuff
  var loginDialog = null;
  function openLoginDialog() {
    if ( loginDialog ) {
        throw new Error('Trying to open a dialog that is already open!');
    }
    loginDialog = $modal.open({ templateUrl:'views/security/login/form.tpl.html', controller: 'LoginFormController'});
    loginDialog.result.then(onLoginDialogClose);
  }
  function closeLoginDialog(success) {
    if (loginDialog) {
      loginDialog.close(success);
    }
  }
  function onLoginDialogClose(success) {
    loginDialog = null;
    if ( success ) {
      queue.retryAll();
    } else {
      queue.cancelAll();
      redirect();
    }
  }

  // Register a handler for when an item is added to the retry queue
  queue.onItemAddedCallbacks.push(function(retryItem) {
    if ( queue.hasMore() ) {
      service.showLogin();
    }
  });

  // The public API of the service
  var service = {
       // Get the first reason for needing a login
    getLoginReason: function() {
      return queue.retryReason();
    },

    // Show the modal login dialog
    showLogin: function() {
      openLoginDialog();
    },

    // Attempt to authenticate a user by the given email and password
    login: function(code, password) {
	/*  if(!queue.hasMore()){
	      var securityAuthorization=$injector.get('securityAuthorization');
	      queue.pushRetryFn('unauthenticated-client', 
		    securityAuthorization.requireAuthenticatedUser);
	  }*/
      var request = $http.post('/login', {code: code, password: password});
      return request.then(function(response) {
        service.currentUser = response.data.user;
       // globalData.setCurrentUser(service.currentUser);
		console.log("/login-->",service.currentUser);
        if ( service.isAuthenticated() ) {
          closeLoginDialog(true);
          $rootScope.$broadcast('user:authenticated', service.currentUser);
   
        }
        return service.isAuthenticated();
      });
    },

    // Give up trying to login and clear the retry queue
    cancelLogin: function() {
      closeLoginDialog(false);
      redirect();
    },

    // Logout the current user and redirect
    logout: function(redirectTo) {
      $http.post('/logout').then(function() {
        service.currentUser = null;
        redirect(redirectTo);
      });
    },

    // Ask the backend to see if a user is already authenticated - this may be from a previous session.
    requestCurrentUser: function() {
      if ( service.isAuthenticated() ) {
        return $q.when(service.currentUser);
      } else {
        return $http.get('/current-user').then(function(response) {
		  service.currentUser = response.data.user;
          console.log("$http.get('/current-user')",service.currentUser);
         // $rootScope.currentUser=service.currentUser;
          return service.currentUser;
        });
      }
    },

    // Information about the current user
    currentUser: null,

    // Is the current user authenticated?
    isAuthenticated: function(){
      return !!service.currentUser;
    },

    // Is the current user an adminstrator?
    isAdmin: function() {
      return !!(service.currentUser && service.currentUser.isAdmin);
    }
  };

  return service;
}]);

angular.module('mongoResourceHttp', [])
.factory('$mongoResourceHttp', [
  	      '$http', '$q','SERVER_CFG', 
function ($http, $q,SERVER_CFG) {

    function MongoResourceFactory(collectionName) {
        var dbUrl = SERVER_CFG.URL+'/db/';
		var ress=collectionName;
        var collectionUrl = dbUrl + collectionName;
        var defaultParams = {};//apiKey: config.API_KEY

        var resourceRespTransform = function (response) {
            return new Resource(response.data);
        };

        var resourcesArrayRespTransform = function (response) {
            return response.data.map(function(item){
                return new Resource(item);
            });
        };

        var preparyQueryParam = function (queryJson) {
            return angular.isObject(queryJson) && Object.keys(queryJson).length ? {q: JSON.stringify(queryJson)} : {};
        };

        var Resource = function (data) {
            angular.extend(this, data);
        };
     
        Resource.query = function (queryJson, options) {

            var prepareOptions = function (options) {

                var optionsMapping = {sort: 's', limit: 'l', fields: 'f', skip: 'sk',strict:'strict'};
                var optionsTranslated = {};

                if (options && !angular.equals(options, {})) {
                    angular.forEach(optionsMapping, function (targetOption, sourceOption) {
                        if (angular.isDefined(options[sourceOption])) {
                            if (angular.isObject(options[sourceOption])) {
                                optionsTranslated[targetOption] = JSON.stringify(options[sourceOption]);
                            } else {
                                optionsTranslated[targetOption] = options[sourceOption];
                            }
                        }
                    });
                }
                return optionsTranslated;
            };

            var requestParams = angular.extend({}, defaultParams, preparyQueryParam(queryJson), prepareOptions(options));

            return $http.get(collectionUrl, {params: requestParams}).then(resourcesArrayRespTransform);
        };

        Resource.all = function (options, successcb, errorcb) {
            return Resource.query({}, options || {});
        };
/*
        Resource.count = function (queryJson) {
            return $http.get(collectionUrl, {
                params: angular.extend({}, defaultParams, preparyQueryParam(queryJson), {c: true})
            }).then(function(response){
                return response.data;
            });
        };

        Resource.distinct = function (field, queryJson) {
            return $http.post(dbUrl + '/runCommand', angular.extend({}, queryJson || {}, {
                distinct: collectionName,
                key: field}), {
                params: defaultParams
            }).then(function (response) {
                return response.data.values;
            });
        };*/
       Resource.getName=function () {
				return ress
		};
        Resource.getById = function (id) {
            return $http.get(collectionUrl + '/' + id, {params: defaultParams}).then(resourceRespTransform);
        };

        Resource.getByObjectIds = function (ids) {
                 return Resource.query({_id: {$in: ids}},{strict:true});
        };
        Resource.prototype.$id = function () {
           return this._id;
            
        };
 

        Resource.prototype.$save = function () {
            return $http.post(collectionUrl, this, {params: defaultParams}).then(resourceRespTransform);
        };

        Resource.prototype.$update = function () {
		  /*  if(!this._id) {
			   console.log("update by null id!");
			   return this;
			}*/
            return  $http.put(collectionUrl + "/" + this._id, angular.extend({}, this), {params: defaultParams})
                .then(resourceRespTransform);
        };

        Resource.prototype.$saveOrUpdate = function () {
            return this._id ? this.$update() : this.$save();
        };

        Resource.prototype.$remove = function () {
            return $http['delete'](collectionUrl + "/" + this._id, {params: defaultParams}).then(resourceRespTransform);
        };


        return Resource;
    }

    return MongoResourceFactory;
}]);

angular.module('services.exceptionHandler', ['services.i18nNotifications'])
.factory('exceptionHandlerFactory', [
             '$injector',
   function($injector) {
      return function($delegate) {
         return function (exception, cause) {
            // Lazy load notifications to get around circular dependency
            //Circular dependency: $rootScope <- notifications <- i18nNotifications <- $exceptionHandler
            var i18nNotifications = $injector.get('i18nNotifications')
            // Pass through to original handler
            $delegate(exception, cause)

            // Push a notification error
            i18nNotifications.pushForCurrentRoute('error.fatal', 'danger', {}, {
               exception:exception,
               cause:cause
            })
        }
    }
}])
.config(['$provide', 
 function($provide) {
    $provide.decorator('$exceptionHandler', [
                   '$delegate', 'exceptionHandlerFactory',
        function ($delegate, exceptionHandlerFactory) {
            return exceptionHandlerFactory($delegate)
        }
    ])
}])

angular.module('services.httpRequestTracker', [])
.factory('httpRequestTracker', ['$http', function($http){
	var httpRequestTracker = {}
	httpRequestTracker.hasPendingRequests = function() {
		return $http.pendingRequests.length > 0
	}
	return httpRequestTracker
}])
angular.module('services.i18nNotifications', ['services.notifications', 'services.localizedMessages']);
angular.module('services.i18nNotifications').factory('i18nNotifications', ['localizedMessages', 'notifications', function (localizedMessages, notifications) {

  var prepareNotification = function(msgKey, type, interpolateParams, otherProperties) {
     return angular.extend({
       message: localizedMessages.get(msgKey, interpolateParams),
       type: type
     }, otherProperties);
  };

  var I18nNotifications = {
    pushSticky:function (msgKey, type, interpolateParams, otherProperties) {
      return notifications.pushSticky(prepareNotification(msgKey, type, interpolateParams, otherProperties));
    },
    pushForCurrentRoute:function (msgKey, type, interpolateParams, otherProperties) {
      return notifications.pushForCurrentRoute(prepareNotification(msgKey, type, interpolateParams, otherProperties));
    },
    pushForNextRoute:function (msgKey, type, interpolateParams, otherProperties) {
      return notifications.pushForNextRoute(prepareNotification(msgKey, type, interpolateParams, otherProperties));
    },
    getCurrent:function () {
      return notifications.getCurrent();
    },
    remove:function (notification) {
      return notifications.remove(notification);
    }
  };

  return I18nNotifications;
}]);
angular.module('services.localizedMessages', []).factory('localizedMessages', ['$interpolate', 'I18N.MESSAGES', function ($interpolate, i18nmessages) {

  var handleNotFound = function (msg, msgKey) {
    return msg || '?' + msgKey + '?';
  };

  return {
    get : function (msgKey, interpolateParams) {
      var msg =  i18nmessages[msgKey];
      if (msg) {
        return $interpolate(msg)(interpolateParams);
      } else {
        return handleNotFound(msg, msgKey);
      }
    }
  };
}]);
angular.module('services.notifications', []).factory('notifications', ['$rootScope', function ($rootScope) {

  var notifications = {
    'STICKY' : [],
    'ROUTE_CURRENT' : [],
    'ROUTE_NEXT' : []
  };
  var notificationsService = {};

  var addNotification = function (notificationsArray, notificationObj) {
    if (!angular.isObject(notificationObj)) {
      throw new Error("Only object can be added to the notification service");
    }
    notificationsArray.push(notificationObj);
    return notificationObj;
  };

  $rootScope.$on('$stateChangeSuccess', function () {
    notifications.ROUTE_CURRENT.length = 0;

    notifications.ROUTE_CURRENT = angular.copy(notifications.ROUTE_NEXT);
    notifications.ROUTE_NEXT.length = 0;
  });

  notificationsService.getCurrent = function(){
    return [].concat(notifications.STICKY, notifications.ROUTE_CURRENT);
  };

  notificationsService.pushSticky = function(notification) {
    return addNotification(notifications.STICKY, notification);
  };

  notificationsService.pushForCurrentRoute = function(notification) {
    return addNotification(notifications.ROUTE_CURRENT, notification);
  };

  notificationsService.pushForNextRoute = function(notification) {
    return addNotification(notifications.ROUTE_NEXT, notification);
  };

  notificationsService.remove = function(notification){
    angular.forEach(notifications, function (notificationsByType) {
      var idx = notificationsByType.indexOf(notification);
      if (idx>-1){
        notificationsByType.splice(idx,1);
      }
    });
  };

  notificationsService.removeAll = function(){
    angular.forEach(notifications, function (notificationsByType) {
      notificationsByType.length = 0;
    });
  };

  return notificationsService;
}]);

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
					controller:  Ress+'CreateCtrl',
				    resolve: {
	                  currentUser: securityAuthorizationProvider.requireAuthenticatedUser
	                }
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

angular.module('directives.crud', ['directives.crud.buttons', 'directives.crud.edit']);

angular.module('directives.crud.buttons', [])

.directive('crudButtons', function () {
  return {
    restrict:'E',
    replace:true,
    template:
      '<div>' +
      '  <button type="button" class="btn btn-primary save" ng-disabled="!canSave()" ng-click="save()">保　存</button>' +
      '  <button type="button" class="btn btn-warning revert" ng-click="revertChanges()" ng-disabled="!canRevert()">撤　销</button>'+
      '  <button type="button" class="btn btn-danger remove" ng-click="remove()" ng-show="canRemove()">删　除</button>'+
      '</div>'
  };
});

angular.module('directives.crud.edit', [])

// Apply this directive to an element at or below a form that will manage CRUD operations on a resource.
// - The resource must expose the following instance methods: $saveOrUpdate(), $id() and $remove()
.directive('crudEdit', [
           '$parse', '$stateParams',  '$state',
function($parse, $stateParams,   $state) {
  return {
    // We ask this directive to create a new child scope so that when we add helper methods to the scope
    // it doesn't make a mess of the parent scope.
    // - Be aware that if you write to the scope from within the form then you must remember that there is a child scope at the point
    scope: true,
    // We need access to a form so we require a FormController from this element or a parent element
    require: '^form',
    // This directive can only appear as an attribute
    link: function(scope, element, attrs, form) {
      // We extract the value of the crudEdit attribute
      // - it should be an assignable expression evaluating to the model (resource) that is going to be edited
      var resourceGetter = $parse(attrs.crudEdit);
      var resourceSetter = resourceGetter.assign;
      // Store the resource object for easy access
      var resource = resourceGetter(scope);
      // Store a copy for reverting the changes
      var original = angular.copy(resource);

      var checkResourceMethod = function(methodName) {
        if ( !angular.isFunction(resource[methodName]) ) {
          throw new Error('crudEdit directive: The resource must expose the ' + methodName + '() instance method');
        }
      };
      checkResourceMethod('$saveOrUpdate');
      checkResourceMethod('$id');
      checkResourceMethod('$remove');

      // This function helps us extract the callback functions from the directive attributes
      var makeFn = function(attrName) {
        var fn = scope.$eval(attrs[attrName]);
        if ( !angular.isFunction(fn) ) {
          throw new Error('crudEdit directive: The attribute "' + attrName + '" must evaluate to a function');
        }
        return fn;
      };
      // Set up callbacks with fallback
      // onSave attribute -> onSave scope -> noop
      var userOnSave = attrs.onSave ? makeFn('onSave') : ( scope.onSave || angular.noop);
      var onSave = function(result, status, headers, config) {
        // Reset the original to help with reverting and pristine checks
        original = result;
        userOnSave(result, status, headers, config);
      };
      // onRemove attribute -> onRemove scope -> onSave attribute -> onSave scope -> noop
      var onRemove = attrs.onRemove ? makeFn('onRemove') : ( scope.onRemove || onSave );
      // onError attribute -> onError scope -> noop
      var onError = attrs.onError ? makeFn('onError') : ( scope.onError || angular.noop );

      // The following functions should be triggered by elements on the form
      // - e.g. ng-click="save()"
      scope.save = function() {
        resource.$saveOrUpdate().then(onSave, onError);
       
      };
      scope.revertChanges = function() {
        resource = angular.copy(original);
        resourceSetter(scope, resource);
        form.$setPristine();
      };
      scope.remove = function() {
        if(resource.$id()) {
          resource.$remove().then(onRemove, onError);
        } else {
          onRemove();
        }
      };

      // The following functions can be called to modify the behaviour of elements in the form
      // - e.g. ng-disable="!canSave()"
      scope.canSave = function() {
        return form.$valid && !angular.equals(resource, original);
      };
      scope.canRevert = function() {
        return !angular.equals(resource, original);
      };
      scope.canRemove = function() {
        return resource.$id();
      };
      /**
       * Get the CSS classes for this item, to be used by the ng-class directive
       * @param {string} fieldName The name of the field on the form, for which we want to get the CSS classes
       * @return {object} A hash where each key is a CSS class and the corresponding value is true if the class is to be applied.
       */
      scope.getCssClasses = function(fieldName) {
        var ngModelController = form[fieldName];
        return {
          error: ngModelController.$invalid && !angular.equals(resource, original),
          success: ngModelController.$valid && !angular.equals(resource, original)
        };
      };
      /**
       * Whether to show an error message for the specified error
       * @param {string} fieldName The name of the field on the form, of which we want to know whether to show the error
       * @param  {string} error - The name of the error as given by a validation directive
       * @return {Boolean} true if the error should be shown
       */
      scope.showError = function(fieldName, error) {
        return form[fieldName].$error[error];
      };
    }
  };
}]);

angular.module('security.login.form', ['services.localizedMessages'])

// The LoginFormController provides the behaviour behind a reusable form to allow users to authenticate.
// This controller and its template (login/form.tpl.html) are used in a modal dialog box by the security service.
.controller('LoginFormController', [
            '$scope', 'security', 'localizedMessages',
	function($scope,   security,   localizedMessages) {
  // The model for this form 
  $scope.user = {};

  // Any error message from failing to login
  $scope.authError = null;

  // The reason that we are being asked to login - for instance because we tried to access something to which we are not authorized
  // We could do something diffent for each reason here but to keep it simple...
  $scope.authReason = null;
  if ( security.getLoginReason() ) {
    $scope.authReason = ( security.isAuthenticated() ) ?
      localizedMessages.get('login.reason.notAuthorized') :
      localizedMessages.get('login.reason.notAuthenticated');
  }

  // Attempt to authenticate the user specified in the form's model
  $scope.login = function() {
    // Clear any previous security errors
    $scope.authError = null;

    // Try to login
    security.login($scope.user.code, $scope.user.password).then(function(loggedIn) {
      if ( !loggedIn ) {
        // If we get here then the login failed due to bad credentials
        $scope.authError = localizedMessages.get('login.error.invalidCredentials');
      }
    }, function(x) {
      // If we get here then there was a problem with the login request to the server
      $scope.authError = localizedMessages.get('login.error.serverError', { exception: x });
    });
  };

  $scope.clearForm = function() {
    $scope.user = {};
  };

  $scope.cancelLogin = function() {
    security.cancelLogin();
  };
}]);

angular.module('security.login', ['security.login.form', 'security.login.toolbar']);
angular.module('security.login.toolbar', [])

// The loginToolbar directive is a reusable widget that can show login or logout buttons
// and information the current authenticated user
.directive('loginToolbar', ['security', function(security) {
  var directive = {
    templateUrl: 'views/security/login/toolbar.tpl.html',
    restrict: 'E',
    replace: true,
    scope: true,
    link: function($scope, $element, $attrs, $controller) {
      $scope.isAuthenticated = security.isAuthenticated;
      $scope.login = security.showLogin;
      $scope.logout = security.logout;
      $scope.$watch(function() {
        return security.currentUser;
      }, function(currentUser) {
        $scope.currentUser = currentUser;
      });
    }
  };
  return directive;
}]);
