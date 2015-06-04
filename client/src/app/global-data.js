angular.module('app').factory('globalData', [
  	              '$http', '$q','$log','SERVER_CFG', 
    function ($http,   $q,    $log,    SERVER_CFG) {
		
        var apiUrl = SERVER_CFG.URL+'/api/';
        var gData={};
        gData.mgrPrjs=[];
         gData.devPrjs=[];
        gData.setCurrentUser=function(user){
		     gData.currentUser=user;
		     if(!user) {
				     gData.mgrPrjs=[];
                     gData.devPrjs=[];
			 }else{
				  var userId=user.id;
		          var req= apiUrl+'projects/mgrby';
		          $log.debug("post :",req);
		         $http.post(req,{userId:userId}).then(function(response) {
		               $log.info("/api/projects/mgrby",response.data);
                       gData.mgrPrjs=response.data;
                  });
                 req= apiUrl+'projects/devby';
                 $log.debug("post :",req);
                  $http.post(req,{userId:userId}).then(function(response) {
		               $log.info("/api/projects/devby",response.data);
                       gData.devPrjs=response.data;
                  });
             }     
		};
        return gData;
     }
  ]);
