angular.module('security.authorization', ['security.service'])
.provider('securityAuthorization', {
  requireAdminUser: ['securityAuthorization', function(securityAuthorization) {
    return securityAuthorization.requireAdminUser()
  }],
   getMyDevProjects: ['securityAuthorization', function(securityAuthorization) {
     return securityAuthorization.getMyDevProjects()
   }],
   getMyPrdMgrPrjs: ['securityAuthorization', function(securityAuthorization) {
     return securityAuthorization.getMyPrdMgrPrjs()
   }],
  requireAuthenticatedUser: ['securityAuthorization', function(securityAuthorization) {
    return securityAuthorization.requireAuthenticatedUser()
  }],

  $get: [  '$http', 'security', 'securityRetryQueue','SERVER_CFG',
    function($http,  security,   queue,               SERVER_CFG) {
    var service = {
	  getMyPrdMgrPrjs: function() {
		var userId= !security.currentUser ? 'NONE':security.currentUser.id;
		var req= SERVER_CFG.URL+'/api/projects/mgrby';
		console.log("myPrdMgrPrjs",req);
		var p=$http.post(req,{userId:userId}).then(function(response) {
		    //console.log("/api/projects/mgrby",response.data);
            return response.data;
        });
        return p;
			  
      },
	  getMyDevProjects: function() {
		var userId= !security.currentUser ? 'NONE':security.currentUser.id;
		var req= SERVER_CFG.URL+'/api/projects/devby';
		console.log("getMyDevProjects",req);
		var p=$http.post(req,{userId:userId}).then(function(response) {
		    //console.log("/api/projects/foruser",response.data);
            return response.data;
        });
        return p;
			  
      },
      requireAuthenticatedUser: function() {
        var promise = security.requestCurrentUser().then(function(userInfo) {
			console.log('requireAuthenticatedUser： return：',userInfo)
          if ( !security.isAuthenticated() ) {
		     console.log('unauthenticated-client！ push requireAuthenticatedUser again' )
            return queue.pushRetryFn('unauthenticated-client', service.requireAuthenticatedUser)
          } else{
		    return security.currentUser
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
		    return security.currentUser
		  }
        });
        return promise
      }

    }

    return service
  }]
})
