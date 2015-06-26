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
   /* if ( loginDialog ) {
        throw new Error('Trying to open a dialog that is already open!');
    }*/
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
