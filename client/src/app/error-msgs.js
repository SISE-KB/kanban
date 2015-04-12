angular.module('app').constant('I18N.MESSAGES', {
  'errors.route.changeError':'前端路由出错',
  'crud.user.save.success':"保存成功用户'{{id}}'",
  'crud.user.remove.success':"'删除成功{{id}}'",
  'crud.user.remove.error':"删除'{{id}}'出错",
  'crud.user.save.error':"保存用户出错...",
  'crud.project.save.success':"项目'{{id}}' 保存成功",
  'crud.project.remove.success':"项目'{{id}}' 删除成功",
  'crud.project.save.error':"保存项目出错...",
  'login.reason.notAuthorized':"无权操作！",
  'login.reason.notAuthenticated':"必须登录后才能访问！",
  'login.error.invalidCredentials': "登录失败，请检查输入是否正确！",
  'login.error.serverError': "服务端错误： {{exception}}."
});
