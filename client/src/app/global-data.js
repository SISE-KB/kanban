angular.module('app').factory('globalData',
       [     '$http', '$log','SERVER_CFG', 
    function ($http,   $log,  SERVER_CFG) {
		
        var apiUrl = SERVER_CFG.URL+'/api/';
        var gData={};
        gData.mgrPrjs=[];
        gData.devPrjs=[];
         	
       	gData.removeItemFromArray=function(arrs,item){
		   var fnd=-1;
		   for(var i=0;i<arrs.length;i++){
		      if(arrs[i]==item){
			     fnd=i;
				 break;
			  }
		   }
		   if(fnd>=0) arrs.splice(fnd,1);
		   
		};
        gData.sendApiRequest=function(req,args){
		   args=!args?{}:args;
		   $log.debug(req,args);
		   return $http.post(apiUrl+req ,args )
		               .then(function(resp){
		                     var data=resp.data;
	 	                     $log.debug('return data:',data);
		                     return data;
		                });     
       	} ;
       	  
       	gData.toResourcesArray = function (Res,data) {
			   var rt=[];
			   if(data&&data.length>0){
				   for(var i=0;i<data.length;i++)
					   rt.push(new Res(data[i]));
				}	   
               return rt;
        };
        
		gData.setCurrentUser=function(user){
		     gData.currentUser=user;
		      $log.debug('setCurrentUser:',gData.currentUser);
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
