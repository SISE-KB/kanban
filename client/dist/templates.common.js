angular.module("templates.common", []).run(["$templateCache", function($templateCache) {
	$templateCache.put("security/login/form.tpl.html",
	"<form name=\"form\" novalidate class=\"login-form\">\n "+
	 " <div class=\"modal-header\">\n  "+
	 "    <h4>Sign in</h4>\n"+
	 " </div>\n    "+
	 " <div class=\"modal-body\">\n    "+
	 "  <div class=\"alert alert-warning\" ng-show=\"authReason\">\n"+
	 "          {{authReason}}\n "+
	 "  </div>\n  " +
	 "  <div class=\"alert alert-danger\" ng-show=\"authError\">\n  "+
	 "       {{authError}}\n "+
	 "  </div>\n      "+
	 "  <div class=\"alert alert-info\">Please enter your login details</div>\n"+
	 "    <label>Mobile No</label>\n     "+
	 "    <input name=\"login\" type=\"text\" ng-model=\"user.mobileNo\" required autofocus>\n "+
	 "    <label>Password</label>\n  "+
	 "    <input name=\"pass\" type=\"password\" ng-model=\"user.password\" required>\n   "+
	 " </div>\n "+
	 " <div class=\"modal-footer\">\n"+
	 "   <button class=\"btn btn-primary login\" ng-click=\"login()\" ng-disabled=\'form.$invalid\'>Sign in</button>\n"+
	 "   <button class=\"btn btn-default clear\" ng-click=\"clearForm()\">Clear</button>\n   "+
	 "   <button class=\"btn btn-warning cancel\" ng-click=\"cancelLogin()\">Cancel</button>\n   "+
	 " </div>\n</form>\n");
$templateCache.put("security/login/toolbar.tpl.html","<ul class=\"nav navbar-nav navbar-right\">\n  <li>\n      <p class=\"navbar-text\" ng-show=\"isAuthenticated()\">{{currentUser.firstName}} {{currentUser.lastName}}</p>\n  </li>\n  <li>\n    <form class=\"navbar-form\">\n      <button ng-show=\"isAuthenticated()\" class=\"btn btn-default logout\" ng-click=\"logout()\">Log out</button>\n      <button ng-show=\"!isAuthenticated()\" class=\"btn btn-default login\" ng-click=\"login()\">Log in</button>\n    </form>\n  </li>\n</ul>");}]);
