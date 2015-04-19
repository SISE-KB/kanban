angular.module('app').constant('I18N.MESSAGES', {
  'errors.route.changeError':'前端路由出错',
  'crud.save.success':"成功保存'{{id}}'",
  'crud.save.error':"保存出错...'{{id}}'",
  'crud.remove.success':"成功删除'{{id}}'",
  'crud.remove.error':"删除出错...'{{id}}'",

  'login.reason.notAuthorized':"无权操作！",
  'login.reason.notAuthenticated':"必须登录后才能访问！",
  'login.error.invalidCredentials': "登录失败，请检查输入是否正确！",
  'login.error.serverError': "服务端错误： {{exception}}."
});
