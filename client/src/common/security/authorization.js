angular.module('security.authorization', ['security.service'])
.provider('securityAuthorization', {
  requireAdminUser: ['securityAuthorization', function(securityAuthorization) {
    return securityAuthorization.requireAdminUser()
  }],
  requireAuthenticatedUser: ['securityAuthorization', function(securityAuthorization) {
    return securityAuthorization.requireAuthenticatedUser()
  }],

  $get: [  '$http', 'security', 'securityRetryQueue','SERVER_CFG','globalData',
    function($http,  security,   queue,               SERVER_CFG,globalData) {
    var service = {
	
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
