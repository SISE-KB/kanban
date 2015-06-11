angular.module('resources.projects', ['mongoResourceHttp']);
angular.module('resources.projects').factory('Project', ['$mongoResourceHttp', function ($mongoResourceHttp) {

  var Project = $mongoResourceHttp('projects');

  Project.forProductMgr = function(userId) {
	return Project.query({productOwnerId:userId},{strict:true});
  };

  Project.prototype.isProductOwner = function (userId) {
    return this.productOwnerId === userId;
  };

  Project.prototype.isDevMaster = function (userId) {
    return this.devMasterId === userId;
  };

  Project.prototype.isDevTeamMember = function (userId) {
    return this.teamMembers.indexOf(userId) >= 0;
  };


  Project.prototype.getRoles = function (userId) {
    var roles = [];
    if (this.isProductOwner(userId)) {
      roles.push('产品经理');
    } else {
      if (this.isDevMaster(userId)){
        roles.push('开发组长');
      }
      if (this.isDevTeamMember(userId)){
        roles.push('开发成员');
      }
    }
    return roles;
  };

  return Project;
}]);
