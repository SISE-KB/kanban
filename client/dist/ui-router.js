"undefined"!=typeof module&&"undefined"!=typeof exports&&module.exports===exports&&(module.exports="ui.router"),function(e,t,r){"use strict";function n(e,t){return U(new(U(function(){},{prototype:e})),t)}function a(e){return D(arguments,function(t){t!==e&&D(t,function(t,r){e.hasOwnProperty(r)||(e[r]=t)})}),e}function i(e,t){var r=[];for(var n in e.path){if(e.path[n]!==t.path[n])break;r.push(e.path[n])}return r}function o(e){if(Object.keys)return Object.keys(e);var t=[];return D(e,function(e,r){t.push(r)}),t}function u(e,t){if(Array.prototype.indexOf)return e.indexOf(t,Number(arguments[2])||0);var r=e.length>>>0,n=Number(arguments[2])||0;for(n=0>n?Math.ceil(n):Math.floor(n),0>n&&(n+=r);r>n;n++)if(n in e&&e[n]===t)return n;return-1}function s(e,t,r,n){var a,s=i(r,n),l={},c=[];for(var f in s)if(s[f].params&&(a=o(s[f].params),a.length))for(var p in a)u(c,a[p])>=0||(c.push(a[p]),l[a[p]]=e[a[p]]);return U({},l,t)}function l(e,t,r){if(!r){r=[];for(var n in e)r.push(n)}for(var a=0;a<r.length;a++){var i=r[a];if(e[i]!=t[i])return!1}return!0}function c(e,t){var r={};return D(e,function(e){r[e]=t[e]}),r}function f(e){var t={},r=Array.prototype.concat.apply(Array.prototype,Array.prototype.slice.call(arguments,1));return D(r,function(r){r in e&&(t[r]=e[r])}),t}function p(e){var t={},r=Array.prototype.concat.apply(Array.prototype,Array.prototype.slice.call(arguments,1));for(var n in e)-1==u(r,n)&&(t[n]=e[n]);return t}function h(e,t){var r=F(e),n=r?[]:{};return D(e,function(e,a){t(e,a)&&(n[r?n.length:a]=e)}),n}function v(e,t){var r=F(e)?[]:{};return D(e,function(e,n){r[n]=t(e,n)}),r}function $(e,t){var n=1,i=2,s={},l=[],c=s,f=U(e.when(s),{$$promises:s,$$values:s});this.study=function(s){function h(e,r){if(g[r]!==i){if(m.push(r),g[r]===n)throw m.splice(0,u(m,r)),new Error("Cyclic dependency: "+m.join(" -> "));if(g[r]=n,N(e))d.push(r,[function(){return t.get(e)}],l);else{var a=t.annotate(e);D(a,function(e){e!==r&&s.hasOwnProperty(e)&&h(s[e],e)}),d.push(r,e,a)}m.pop(),g[r]=i}}function v(e){return R(e)&&e.then&&e.$$promises}if(!R(s))throw new Error("'invocables' must be an object");var $=o(s||{}),d=[],m=[],g={};return D(s,h),s=m=g=null,function(n,i,o){function u(){--w||(b||a(y,i.$$values),m.$$values=y,m.$$promises=m.$$promises||!0,delete m.$$inheritedValues,h.resolve(y))}function s(e){m.$$failure=e,h.reject(e)}function l(r,a,i){function l(e){f.reject(e),s(e)}function c(){if(!V(m.$$failure))try{f.resolve(t.invoke(a,o,y)),f.promise.then(function(e){y[r]=e,u()},l)}catch(e){l(e)}}var f=e.defer(),p=0;D(i,function(e){g.hasOwnProperty(e)&&!n.hasOwnProperty(e)&&(p++,g[e].then(function(t){y[e]=t,--p||c()},l))}),p||c(),g[r]=f.promise}if(v(n)&&o===r&&(o=i,i=n,n=null),n){if(!R(n))throw new Error("'locals' must be an object")}else n=c;if(i){if(!v(i))throw new Error("'parent' must be a promise returned by $resolve.resolve()")}else i=f;var h=e.defer(),m=h.promise,g=m.$$promises={},y=U({},n),w=1+d.length/3,b=!1;if(V(i.$$failure))return s(i.$$failure),m;i.$$inheritedValues&&a(y,p(i.$$inheritedValues,$)),U(g,i.$$promises),i.$$values?(b=a(y,p(i.$$values,$)),m.$$inheritedValues=p(i.$$values,$),u()):(i.$$inheritedValues&&(m.$$inheritedValues=p(i.$$inheritedValues,$)),i.then(u,s));for(var E=0,S=d.length;S>E;E+=3)n.hasOwnProperty(d[E])?u():l(d[E],d[E+1],d[E+2]);return m}},this.resolve=function(e,t,r,n){return this.study(e)(t,r,n)}}function d(e,t,r){this.fromConfig=function(e,t,r){return V(e.template)?this.fromString(e.template,t):V(e.templateUrl)?this.fromUrl(e.templateUrl,t):V(e.templateProvider)?this.fromProvider(e.templateProvider,t,r):null},this.fromString=function(e,t){return M(e)?e(t):e},this.fromUrl=function(r,n){return M(r)&&(r=r(n)),null==r?null:e.get(r,{cache:t,headers:{Accept:"text/html"}}).then(function(e){return e.data})},this.fromProvider=function(e,t,n){return r.invoke(e,null,n||{params:t})}}function m(e,t,a){function i(t,r,n,a){if(d.push(t),v[t])return v[t];if(!/^\w+(-+\w+)*(?:\[\])?$/.test(t))throw new Error("Invalid parameter name '"+t+"' in pattern '"+e+"'");if($[t])throw new Error("Duplicate parameter name '"+t+"' in pattern '"+e+"'");return $[t]=new z.Param(t,r,n,a),$[t]}function o(e,t,r,n){var a=["",""],i=e.replace(/[\\\[\]\^$*+?.()|{}]/g,"\\$&");if(!t)return i;switch(r){case!1:a=["(",")"+(n?"?":"")];break;case!0:a=["?(",")?"];break;default:a=["("+r+"|",")?"]}return i+a[0]+t+a[1]}function u(a,i){var o,u,s,l,c;return o=a[2]||a[3],c=t.params[o],s=e.substring(p,a.index),u=i?a[4]:a[4]||("*"==a[1]?".*":null),l=z.type(u||"string")||n(z.type("string"),{pattern:new RegExp(u,t.caseInsensitive?"i":r)}),{id:o,regexp:u,segment:s,type:l,cfg:c}}t=U({params:{}},R(t)?t:{});var s,l=/([:*])([\w\[\]]+)|\{([\w\[\]]+)(?:\:((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,c=/([:]?)([\w\[\]-]+)|\{([\w\[\]-]+)(?:\:((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,f="^",p=0,h=this.segments=[],v=a?a.params:{},$=this.params=a?a.params.$$new():new z.ParamSet,d=[];this.source=e;for(var m,g,y;(s=l.exec(e))&&(m=u(s,!1),!(m.segment.indexOf("?")>=0));)g=i(m.id,m.type,m.cfg,"path"),f+=o(m.segment,g.type.pattern.source,g.squash,g.isOptional),h.push(m.segment),p=l.lastIndex;y=e.substring(p);var w=y.indexOf("?");if(w>=0){var b=this.sourceSearch=y.substring(w);if(y=y.substring(0,w),this.sourcePath=e.substring(0,p+w),b.length>0)for(p=0;s=c.exec(b);)m=u(s,!0),g=i(m.id,m.type,m.cfg,"search"),p=l.lastIndex}else this.sourcePath=e,this.sourceSearch="";f+=o(y)+(t.strict===!1?"/?":"")+"$",h.push(y),this.regexp=new RegExp(f,t.caseInsensitive?"i":r),this.prefix=h[0],this.$$paramNames=d}function g(e){U(this,e)}function y(){function e(e){return null!=e?e.toString().replace(/\//g,"%2F"):e}function a(e){return null!=e?e.toString().replace(/%2F/g,"/"):e}function i(){return{strict:$,caseInsensitive:p}}function s(e){return M(e)||F(e)&&M(e[e.length-1])}function l(){for(;E.length;){var e=E.shift();if(e.pattern)throw new Error("You cannot override a type's .pattern at runtime.");t.extend(w[e.name],f.invoke(e.def))}}function c(e){U(this,e||{})}z=this;var f,p=!1,$=!0,d=!1,w={},b=!0,E=[],S={string:{encode:e,decode:a,is:function(e){return null==e||!V(e)||"string"==typeof e},pattern:/[^/]*/},"int":{encode:e,decode:function(e){return parseInt(e,10)},is:function(e){return V(e)&&this.decode(e.toString())===e},pattern:/\d+/},bool:{encode:function(e){return e?1:0},decode:function(e){return 0!==parseInt(e,10)},is:function(e){return e===!0||e===!1},pattern:/0|1/},date:{encode:function(e){return this.is(e)?[e.getFullYear(),("0"+(e.getMonth()+1)).slice(-2),("0"+e.getDate()).slice(-2)].join("-"):r},decode:function(e){if(this.is(e))return e;var t=this.capture.exec(e);return t?new Date(t[1],t[2]-1,t[3]):r},is:function(e){return e instanceof Date&&!isNaN(e.valueOf())},equals:function(e,t){return this.is(e)&&this.is(t)&&e.toISOString()===t.toISOString()},pattern:/[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])/,capture:/([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/},json:{encode:t.toJson,decode:t.fromJson,is:t.isObject,equals:t.equals,pattern:/[^/]*/},any:{encode:t.identity,decode:t.identity,equals:t.equals,pattern:/.*/}};y.$$getDefaultValue=function(e){if(!s(e.value))return e.value;if(!f)throw new Error("Injectable functions cannot be called at configuration time");return f.invoke(e.value)},this.caseInsensitive=function(e){return V(e)&&(p=e),p},this.strictMode=function(e){return V(e)&&($=e),$},this.defaultSquashPolicy=function(e){if(!V(e))return d;if(e!==!0&&e!==!1&&!N(e))throw new Error("Invalid squash policy: "+e+". Valid policies: false, true, arbitrary-string");return d=e,e},this.compile=function(e,t){return new m(e,U(i(),t))},this.isMatcher=function(e){if(!R(e))return!1;var t=!0;return D(m.prototype,function(r,n){M(r)&&(t=t&&V(e[n])&&M(e[n]))}),t},this.type=function(e,t,r){if(!V(t))return w[e];if(w.hasOwnProperty(e))throw new Error("A type named '"+e+"' has already been defined.");return w[e]=new g(U({name:e},t)),r&&(E.push({name:e,def:r}),b||l()),this},D(S,function(e,t){w[t]=new g(U({name:t},e))}),w=n(w,{}),this.$get=["$injector",function(e){return f=e,b=!1,l(),D(S,function(e,t){w[t]||(w[t]=new g(e))}),this}],this.Param=function(e,t,n,a){function i(e){var t=R(e)?o(e):[],r=-1===u(t,"value")&&-1===u(t,"type")&&-1===u(t,"squash")&&-1===u(t,"array");return r&&(e={value:e}),e.$$fn=s(e.value)?e.value:function(){return e.value},e}function l(t,r,n){if(t.type&&r)throw new Error("Param '"+e+"' has two type configurations.");return r?r:t.type?t.type instanceof g?t.type:new g(t.type):"config"===n?w.any:w.string}function c(){var t={array:"search"===a?"auto":!1},r=e.match(/\[\]$/)?{array:!0}:{};return U(t,r,n).array}function p(e,t){var r=e.squash;if(!t||r===!1)return!1;if(!V(r)||null==r)return d;if(r===!0||N(r))return r;throw new Error("Invalid squash policy: '"+r+"'. Valid policies: false, true, or arbitrary string")}function $(e,t,n,a){var i,o,s=[{from:"",to:n||t?r:""},{from:null,to:n||t?r:""}];return i=F(e.replace)?e.replace:[],N(a)&&i.push({from:a,to:r}),o=v(i,function(e){return e.from}),h(s,function(e){return-1===u(o,e.from)}).concat(i)}function m(){if(!f)throw new Error("Injectable functions cannot be called at configuration time");var e=f.invoke(n.$$fn);if(null!==e&&e!==r&&!E.type.is(e))throw new Error("Default value ("+e+") for parameter '"+E.id+"' is not an instance of Type ("+E.type.name+")");return e}function y(e){function t(e){return function(t){return t.from===e}}function r(e){var r=v(h(E.replace,t(e)),function(e){return e.to});return r.length?r[0]:e}return e=r(e),V(e)?E.type.$normalize(e):m()}function b(){return"{Param:"+e+" "+t+" squash: '"+P+"' optional: "+x+"}"}var E=this;n=i(n),t=l(n,t,a);var S=c();t=S?t.$asArray(S,"search"===a):t,"string"!==t.name||S||"path"!==a||n.value!==r||(n.value="");var x=n.value!==r,P=p(n,x),j=$(n,S,x,P);U(this,{id:e,type:t,location:a,array:S,squash:P,replace:j,isOptional:x,value:y,dynamic:r,config:n,toString:b})},c.prototype={$$new:function(){return n(this,U(new c,{$$parent:this}))},$$keys:function(){for(var e=[],t=[],r=this,n=o(c.prototype);r;)t.push(r),r=r.$$parent;return t.reverse(),D(t,function(t){D(o(t),function(t){-1===u(e,t)&&-1===u(n,t)&&e.push(t)})}),e},$$values:function(e){var t={},r=this;return D(r.$$keys(),function(n){t[n]=r[n].value(e&&e[n])}),t},$$equals:function(e,t){var r=!0,n=this;return D(n.$$keys(),function(a){var i=e&&e[a],o=t&&t[a];n[a].type.equals(i,o)||(r=!1)}),r},$$validates:function(e){var n,a,i,o,u,s=this.$$keys();for(n=0;n<s.length&&(a=this[s[n]],i=e[s[n]],i!==r&&null!==i||!a.isOptional);n++){if(o=a.type.$normalize(i),!a.type.is(o))return!1;if(u=a.type.encode(o),t.isString(u)&&!a.type.pattern.exec(u))return!1}return!0},$$parent:r},this.ParamSet=c}function w(e,n){function a(e){var t=/^\^((?:\\[^a-zA-Z0-9]|[^\\\[\]\^$*+?.()|{}]+)*)/.exec(e.source);return null!=t?t[1].replace(/\\(.)/g,"$1"):""}function i(e,t){return e.replace(/\$(\$|\d{1,2})/,function(e,r){return t["$"===r?0:Number(r)]})}function o(e,t,r){if(!r)return!1;var n=e.invoke(t,t,{$match:r});return V(n)?n:!0}function u(n,a,i,o){function u(e,t,r){return"/"===$?e:t?$.slice(0,-1)+e:r?$.slice(1)+e:e}function p(e){function t(e){var t=e(i,n);return t?(N(t)&&n.replace().url(t),!0):!1}if(!e||!e.defaultPrevented){{v&&n.url()===v}v=r;var a,o=l.length;for(a=0;o>a;a++)if(t(l[a]))return;c&&t(c)}}function h(){return s=s||a.$on("$locationChangeSuccess",p)}var v,$=o.baseHref(),d=n.url();return f||h(),{sync:function(){p()},listen:function(){return h()},update:function(e){return e?(d=n.url(),void 0):(n.url()!==d&&(n.url(d),n.replace()),void 0)},push:function(e,t,a){var i=e.format(t||{});null!==i&&t&&t["#"]&&(i+="#"+t["#"]),n.url(i),v=a&&a.$$avoidResync?n.url():r,a&&a.replace&&n.replace()},href:function(r,a,i){if(!r.validates(a))return null;var o=e.html5Mode();t.isObject(o)&&(o=o.enabled);var s=r.format(a);if(i=i||{},o||null===s||(s="#"+e.hashPrefix()+s),null!==s&&a&&a["#"]&&(s+="#"+a["#"]),s=u(s,o,i.absolute),!i.absolute||!s)return s;var l=!o&&s?"/":"",c=n.port();return c=80===c||443===c?"":":"+c,[n.protocol(),"://",n.host(),c,l,s].join("")}}}var s,l=[],c=null,f=!1;this.rule=function(e){if(!M(e))throw new Error("'rule' must be a function");return l.push(e),this},this.otherwise=function(e){if(N(e)){var t=e;e=function(){return t}}else if(!M(e))throw new Error("'rule' must be a function");return c=e,this},this.when=function(e,t){var r,u=N(t);if(N(e)&&(e=n.compile(e)),!u&&!M(t)&&!F(t))throw new Error("invalid 'handler' in when()");var s={matcher:function(e,t){return u&&(r=n.compile(t),t=["$match",function(e){return r.format(e)}]),U(function(r,n){return o(r,t,e.exec(n.path(),n.search()))},{prefix:N(e.prefix)?e.prefix:""})},regex:function(e,t){if(e.global||e.sticky)throw new Error("when() RegExp must not be global or sticky");return u&&(r=t,t=["$match",function(e){return i(r,e)}]),U(function(r,n){return o(r,t,e.exec(n.path()))},{prefix:a(e)})}},l={matcher:n.isMatcher(e),regex:e instanceof RegExp};for(var c in l)if(l[c])return this.rule(s[c](e,t));throw new Error("invalid 'what' in when()")},this.deferIntercept=function(e){e===r&&(e=!0),f=e},this.$get=u,u.$inject=["$location","$rootScope","$injector","$browser"]}function b(e,a){function i(e){return 0===e.indexOf(".")||0===e.indexOf("^")}function p(e,t){if(!e)return r;var n=N(e),a=n?e:e.name,o=i(a);if(o){if(!t)throw new Error("No reference point given for path '"+a+"'");t=p(t);for(var u=a.split("."),s=0,l=u.length,c=t;l>s;s++)if(""!==u[s]||0!==s){if("^"!==u[s])break;if(!c.parent)throw new Error("Path '"+a+"' not valid for state '"+t.name+"'");c=c.parent}else c=t;u=u.slice(s).join("."),a=c.name+(c.name&&u?".":"")+u}var f=P[a];return!f||!n&&(n||f!==e&&f.self!==e)?r:f}function h(e,t){j[e]||(j[e]=[]),j[e].push(t)}function $(e){for(var t=j[e]||[];t.length;)d(t.shift())}function d(t){t=n(t,{self:t,resolve:t.resolve||{},toString:function(){return this.name}});var r=t.name;if(!N(r)||r.indexOf("@")>=0)throw new Error("State must have a valid name");if(P.hasOwnProperty(r))throw new Error("State '"+r+"'' is already defined");var a=-1!==r.indexOf(".")?r.substring(0,r.lastIndexOf(".")):N(t.parent)?t.parent:R(t.parent)&&N(t.parent.name)?t.parent.name:"";if(a&&!P[a])return h(a,t.self);for(var i in O)M(O[i])&&(t[i]=O[i](t,O.$delegates[i]));return P[r]=t,!t[A]&&t.url&&e.when(t.url,["$match","$stateParams",function(e,r){x.$current.navigable==t&&l(e,r)||x.transitionTo(t,e,{inherit:!0,location:!1})}]),$(r),t}function m(e){return e.indexOf("*")>-1}function g(e){for(var t=e.split("."),r=x.$current.name.split("."),n=0,a=t.length;a>n;n++)"*"===t[n]&&(r[n]="*");return"**"===t[0]&&(r=r.slice(u(r,t[1])),r.unshift("**")),"**"===t[t.length-1]&&(r.splice(u(r,t[t.length-2])+1,Number.MAX_VALUE),r.push("**")),t.length!=r.length?!1:r.join("")===t.join("")}function y(e,t){return N(e)&&!V(t)?O[e]:M(t)&&N(e)?(O[e]&&!O.$delegates[e]&&(O.$delegates[e]=O[e]),O[e]=t,this):this}function w(e,t){return R(e)?t=e:t.name=e,d(t),this}function b(e,a,i,u,f,h,$){function d(t,r,n,i){var o=e.$broadcast("$stateNotFound",t,r,n);if(o.defaultPrevented)return $.update(),j;if(!o.retry)return null;if(i.$retry)return $.update(),O;var u=x.transition=a.when(o.retry);return u.then(function(){return u!==x.transition?w:(t.options.$retry=!0,x.transitionTo(t.to,t.toParams,t.options))},function(){return j}),$.update(),u}function y(e,r,n,o,s,l){function p(){var r=[];return D(e.views,function(n,a){var o=n.resolve&&n.resolve!==e.resolve?n.resolve:{};o.$template=[function(){return i.load(a,{view:n,locals:s.globals,params:h,notify:l.notify})||""}],r.push(f.resolve(o,s.globals,s.resolve,e).then(function(r){if(M(n.controllerProvider)||F(n.controllerProvider)){var i=t.extend({},o,s.globals);r.$$controller=u.invoke(n.controllerProvider,null,i)}else r.$$controller=n.controller;r.$$state=e,r.$$controllerAs=n.controllerAs,s[a]=r}))}),a.all(r).then(function(){return s.globals})}var h=n?r:c(e.params.$$keys(),r),v={$stateParams:h};s.resolve=f.resolve(e.resolve,v,s.resolve,e);var $=[s.resolve.then(function(e){s.globals=e})];return o&&$.push(o),a.all($).then(p).then(function(){return s})}var w=a.reject(new Error("transition superseded")),b=a.reject(new Error("transition prevented")),j=a.reject(new Error("transition aborted")),O=a.reject(new Error("transition failed"));return S.locals={resolve:null,globals:{$stateParams:{}}},x={params:{},current:S.self,$current:S,transition:null},x.reload=function(e){return x.transitionTo(x.current,h,{reload:e||!0,inherit:!1,notify:!0})},x.go=function(e,t,r){return x.transitionTo(e,t,U({inherit:!0,relative:x.$current},r))},x.transitionTo=function(t,r,i){r=r||{},i=U({location:!0,inherit:!1,relative:null,notify:!0,reload:!1,$retry:!1},i||{});var o,l=x.$current,f=x.params,v=l.path,m=p(t,i.relative),g=r["#"];if(!V(m)){var P={to:t,toParams:r,options:i},j=d(P,l.self,f,i);if(j)return j;if(t=P.to,r=P.toParams,i=P.options,m=p(t,i.relative),!V(m)){if(!i.relative)throw new Error("No such state '"+t+"'");throw new Error("Could not resolve '"+t+"' from state '"+i.relative+"'")}}if(m[A])throw new Error("Cannot transition to abstract state '"+t+"'");if(i.inherit&&(r=s(h,r||{},x.$current,m)),!m.params.$$validates(r))return O;r=m.params.$$values(r),t=m;var C=t.path,q=0,k=C[q],I=S.locals,M=[];if(i.reload){if(N(i.reload)||R(i.reload)){if(R(i.reload)&&!i.reload.name)throw new Error("Invalid reload state object");var F=i.reload===!0?v[0]:p(i.reload);if(i.reload&&!F)throw new Error("No such reload state '"+(N(i.reload)?i.reload:i.reload.name)+"'");for(;k&&k===v[q]&&k!==F;)I=M[q]=k.locals,q++,k=C[q]}}else for(;k&&k===v[q]&&k.ownParams.$$equals(r,f);)I=M[q]=k.locals,q++,k=C[q];if(E(t,r,l,f,I,i))return g&&(r["#"]=g),x.params=r,T(x.params,h),i.location&&t.navigable&&t.navigable.url&&($.push(t.navigable.url,r,{$$avoidResync:!0,replace:"replace"===i.location}),$.update(!0)),x.transition=null,a.when(x.current);if(r=c(t.params.$$keys(),r||{}),i.notify&&e.$broadcast("$stateChangeStart",t.self,r,l.self,f).defaultPrevented)return e.$broadcast("$stateChangeCancel",t.self,r,l.self,f),$.update(),b;for(var D=a.when(I),z=q;z<C.length;z++,k=C[z])I=M[z]=n(I),D=y(k,r,k===t,D,I,i);var L=x.transition=D.then(function(){var n,a,o;if(x.transition!==L)return w;for(n=v.length-1;n>=q;n--)o=v[n],o.self.onExit&&u.invoke(o.self.onExit,o.self,o.locals.globals),o.locals=null;for(n=q;n<C.length;n++)a=C[n],a.locals=M[n],a.self.onEnter&&u.invoke(a.self.onEnter,a.self,a.locals.globals);return g&&(r["#"]=g),x.transition!==L?w:(x.$current=t,x.current=t.self,x.params=r,T(x.params,h),x.transition=null,i.location&&t.navigable&&$.push(t.navigable.url,t.navigable.locals.globals.$stateParams,{$$avoidResync:!0,replace:"replace"===i.location}),i.notify&&e.$broadcast("$stateChangeSuccess",t.self,r,l.self,f),$.update(!0),x.current)},function(n){return x.transition!==L?w:(x.transition=null,o=e.$broadcast("$stateChangeError",t.self,r,l.self,f,n),o.defaultPrevented||$.update(),a.reject(n))});return L},x.is=function(e,t,n){n=U({relative:x.$current},n||{});var a=p(e,n.relative);return V(a)?x.$current!==a?!1:t?l(a.params.$$values(t),h):!0:r},x.includes=function(e,t,n){if(n=U({relative:x.$current},n||{}),N(e)&&m(e)){if(!g(e))return!1;e=x.$current.name}var a=p(e,n.relative);return V(a)?V(x.$current.includes[a.name])?t?l(a.params.$$values(t),h,o(t)):!0:!1:r},x.href=function(e,t,n){n=U({lossy:!0,inherit:!0,absolute:!1,relative:x.$current},n||{});var a=p(e,n.relative);if(!V(a))return null;n.inherit&&(t=s(h,t||{},x.$current,a));var i=a&&n.lossy?a.navigable:a;return i&&i.url!==r&&null!==i.url?$.href(i.url,c(a.params.$$keys().concat("#"),t||{}),{absolute:n.absolute}):null},x.get=function(e,t){if(0===arguments.length)return v(o(P),function(e){return P[e].self});var r=p(e,t||x.$current);return r&&r.self?r.self:null},x}function E(e,t,r,n,a,i){function o(e,t,r){function n(t){return"search"!=e.params[t].location}var a=e.params.$$keys().filter(n),i=f.apply({},[e.params].concat(a)),o=new z.ParamSet(i);return o.$$equals(t,r)}return!i.reload&&e===r&&(a===r.locals||e.self.reloadOnSearch===!1&&o(r,n,t))?!0:void 0}var S,x,P={},j={},A="abstract",O={parent:function(e){if(V(e.parent)&&e.parent)return p(e.parent);var t=/^(.+)\.[^.]+$/.exec(e.name);return t?p(t[1]):S},data:function(e){return e.parent&&e.parent.data&&(e.data=e.self.data=U({},e.parent.data,e.data)),e.data},url:function(e){var t=e.url,r={params:e.params||{}};if(N(t))return"^"==t.charAt(0)?a.compile(t.substring(1),r):(e.parent.navigable||S).url.concat(t,r);if(!t||a.isMatcher(t))return t;throw new Error("Invalid url '"+t+"' in state '"+e+"'")},navigable:function(e){return e.url?e:e.parent?e.parent.navigable:null},ownParams:function(e){var t=e.url&&e.url.params||new z.ParamSet;return D(e.params||{},function(e,r){t[r]||(t[r]=new z.Param(r,null,e,"config"))}),t},params:function(e){return e.parent&&e.parent.params?U(e.parent.params.$$new(),e.ownParams):new z.ParamSet},views:function(e){var t={};return D(V(e.views)?e.views:{"":e},function(r,n){n.indexOf("@")<0&&(n+="@"+e.parent.name),t[n]=r}),t},path:function(e){return e.parent?e.parent.path.concat(e):[]},includes:function(e){var t=e.parent?U({},e.parent.includes):{};return t[e.name]=!0,t},$delegates:{}};S=d({name:"",url:"^",views:null,"abstract":!0}),S.navigable=null,this.decorator=y,this.state=w,this.$get=b,b.$inject=["$rootScope","$q","$view","$injector","$resolve","$stateParams","$urlRouter","$location","$urlMatcherFactory"]}function E(){function e(e,t){return{load:function(r,n){var a,i={template:null,controller:null,view:null,locals:null,notify:!0,async:!0,params:{}};return n=U(i,n),n.view&&(a=t.fromConfig(n.view,n.params,n.locals)),a&&n.notify&&e.$broadcast("$viewContentLoading",n),a}}}this.$get=e,e.$inject=["$rootScope","$templateFactory"]}function S(){var e=!1;this.useAnchorScroll=function(){e=!0},this.$get=["$anchorScroll","$timeout",function(t,r){return e?t:function(e){return r(function(){e[0].scrollIntoView()},0,!1)}}]}function x(e,r,n,a){function i(){return r.has?function(e){return r.has(e)?r.get(e):null}:function(e){try{return r.get(e)}catch(t){return null}}}function o(e,t){var r=function(){return{enter:function(e,t,r){t.after(e),r()},leave:function(e,t){e.remove(),t()}}};if(l)return{enter:function(e,t,r){var n=l.enter(e,null,t,r);n&&n.then&&n.then(r)},leave:function(e,t){var r=l.leave(e,t);r&&r.then&&r.then(t)}};if(s){var n=s&&s(t,e);return{enter:function(e,t,r){n.enter(e,null,t),r()},leave:function(e,t){n.leave(e),t()}}}return r()}var u=i(),s=u("$animator"),l=u("$animate"),c={restrict:"ECA",terminal:!0,priority:400,transclude:"element",compile:function(r,i,u){return function(r,i,s){function l(){f&&(f.remove(),f=null),h&&(h.$destroy(),h=null),p&&(m.leave(p,function(){f=null}),f=p,p=null)}function c(o){var c,f=j(r,s,i,a),g=f&&e.$current&&e.$current.locals[f];if(o||g!==v){c=r.$new(),v=e.$current.locals[f];var y=u(c,function(e){m.enter(e,i,function(){h&&h.$emit("$viewContentAnimationEnded"),(t.isDefined(d)&&!d||r.$eval(d))&&n(e)}),l()});p=y,h=c,h.$emit("$viewContentLoaded"),h.$eval($)}}var f,p,h,v,$=s.onload||"",d=s.autoscroll,m=o(s,r);r.$on("$stateChangeSuccess",function(){c(!1)}),r.$on("$viewContentLoading",function(){c(!1)}),c(!0)}}};return c}function P(e,t,r,n){return{restrict:"ECA",priority:-400,compile:function(a){var i=a.html();return function(a,o,u){var s=r.$current,l=j(a,u,o,n),c=s&&s.locals[l];if(c){o.data("$uiView",{name:l,state:c.$$state}),o.html(c.$template?c.$template:i);var f=e(o.contents());if(c.$$controller){c.$scope=a,c.$element=o;var p=t(c.$$controller,c);c.$$controllerAs&&(a[c.$$controllerAs]=p),o.data("$ngControllerController",p),o.children().data("$ngControllerController",p)}f(a)}}}}}function j(e,t,r,n){var a=n(t.uiView||t.name||"")(e),i=r.inheritedData("$uiView");return a.indexOf("@")>=0?a:a+"@"+(i?i.state.name:"")}function A(e,t){var r,n=e.match(/^\s*({[^}]*})\s*$/);if(n&&(e=t+"("+n[1]+")"),r=e.replace(/\n/g," ").match(/^([^(]+?)\s*(\((.*)\))?$/),!r||4!==r.length)throw new Error("Invalid state ref '"+e+"'");return{state:r[1],paramExpr:r[3]||null}}function O(e){var t=e.parent().inheritedData("$uiView");return t&&t.state&&t.state.name?t.state:void 0}function C(e,r){var n=["location","inherit","reload","absolute"];return{restrict:"A",require:["?^uiSrefActive","?^uiSrefActiveEq"],link:function(a,i,o,u){var s=A(o.uiSref,e.current.name),l=null,c=O(i)||e.$current,f="[object SVGAnimatedString]"===Object.prototype.toString.call(i.prop("href"))?"xlink:href":"href",p=null,h="A"===i.prop("tagName").toUpperCase(),v="FORM"===i[0].nodeName,$=v?"action":f,d=!0,m={relative:c,inherit:!0},g=a.$eval(o.uiSrefOpts)||{};t.forEach(n,function(e){e in g&&(m[e]=g[e])});var y=function(r){if(r&&(l=t.copy(r)),d){p=e.href(s.state,l,m);var n=u[1]||u[0];return n&&n.$$addStateInfo(s.state,l),null===p?(d=!1,!1):(o.$set($,p),void 0)}};s.paramExpr&&(a.$watch(s.paramExpr,function(e){e!==l&&y(e)},!0),l=t.copy(a.$eval(s.paramExpr))),y(),v||i.bind("click",function(t){var n=t.which||t.button;if(!(n>1||t.ctrlKey||t.metaKey||t.shiftKey||i.attr("target"))){var a=r(function(){e.go(s.state,l,m)});t.preventDefault();var o=h&&!p?1:0;t.preventDefault=function(){o--<=0&&r.cancel(a)}}})}}}function q(e,t,r){return{restrict:"A",controller:["$scope","$element","$attrs",function(t,n,a){function i(){o()?n.addClass(s):n.removeClass(s)}function o(){for(var e=0;e<l.length;e++)if(u(l[e].state,l[e].params))return!0;return!1}function u(t,r){return"undefined"!=typeof a.uiSrefActiveEq?e.is(t.name,r):e.includes(t.name,r)}var s,l=[];s=r(a.uiSrefActiveEq||a.uiSrefActive||"",!1)(t),this.$$addStateInfo=function(t,r){var a=e.get(t,O(n));l.push({state:a||{name:t},params:r}),i()},t.$on("$stateChangeSuccess",i)}]}}function k(e){var t=function(t){return e.is(t)};return t.$stateful=!0,t}function I(e){var t=function(t){return e.includes(t)};return t.$stateful=!0,t}var V=t.isDefined,M=t.isFunction,N=t.isString,R=t.isObject,F=t.isArray,D=t.forEach,U=t.extend,T=t.copy;t.module("ui.router.util",["ng"]),t.module("ui.router.router",["ui.router.util"]),t.module("ui.router.state",["ui.router.router","ui.router.util"]),t.module("ui.router",["ui.router.state"]),t.module("ui.router.compat",["ui.router"]),$.$inject=["$q","$injector"],t.module("ui.router.util").service("$resolve",$),d.$inject=["$http","$templateCache","$injector"],t.module("ui.router.util").service("$templateFactory",d);var z;m.prototype.concat=function(e,t){var r={caseInsensitive:z.caseInsensitive(),strict:z.strictMode(),squash:z.defaultSquashPolicy()};return new m(this.sourcePath+e+this.sourceSearch,U(r,t),this)},m.prototype.toString=function(){return this.source},m.prototype.exec=function(e,t){function r(e){function t(e){return e.split("").reverse().join("")}function r(e){return e.replace(/\\-/g,"-")}var n=t(e).split(/-(?!\\)/),a=v(n,t);return v(a,r).reverse()}var n=this.regexp.exec(e);if(!n)return null;t=t||{};var a,i,o,u=this.parameters(),s=u.length,l=this.segments.length-1,c={};if(l!==n.length-1)throw new Error("Unbalanced capture group in route '"+this.source+"'");for(a=0;l>a;a++){o=u[a];var f=this.params[o],p=n[a+1];for(i=0;i<f.replace;i++)f.replace[i].from===p&&(p=f.replace[i].to);p&&f.array===!0&&(p=r(p)),c[o]=f.value(p)}for(;s>a;a++)o=u[a],c[o]=this.params[o].value(t[o]);return c},m.prototype.parameters=function(e){return V(e)?this.params[e]||null:this.$$paramNames},m.prototype.validates=function(e){return this.params.$$validates(e)},m.prototype.format=function(e){function t(e){return encodeURIComponent(e).replace(/-/g,function(e){return"%5C%"+e.charCodeAt(0).toString(16).toUpperCase()})}e=e||{};var r=this.segments,n=this.parameters(),a=this.params;if(!this.validates(e))return null;var i,o=!1,u=r.length-1,s=n.length,l=r[0];for(i=0;s>i;i++){var c=u>i,f=n[i],p=a[f],h=p.value(e[f]),$=p.isOptional&&p.type.equals(p.value(),h),d=$?p.squash:!1,m=p.type.encode(h);if(c){var g=r[i+1];if(d===!1)null!=m&&(l+=F(m)?v(m,t).join("-"):encodeURIComponent(m)),l+=g;else if(d===!0){var y=l.match(/\/$/)?/\/?(.*)/:/(.*)/;l+=g.match(y)[1]}else N(d)&&(l+=d+g)}else{if(null==m||$&&d!==!1)continue;F(m)||(m=[m]),m=v(m,encodeURIComponent).join("&"+f+"="),l+=(o?"&":"?")+(f+"="+m),o=!0}}return l},g.prototype.is=function(){return!0},g.prototype.encode=function(e){return e},g.prototype.decode=function(e){return e},g.prototype.equals=function(e,t){return e==t},g.prototype.$subPattern=function(){var e=this.pattern.toString();return e.substr(1,e.length-2)},g.prototype.pattern=/.*/,g.prototype.toString=function(){return"{Type:"+this.name+"}"},g.prototype.$normalize=function(e){return this.is(e)?e:this.decode(e)},g.prototype.$asArray=function(e,t){function n(e,t){function n(e,t){return function(){return e[t].apply(e,arguments)}}function a(e){return F(e)?e:V(e)?[e]:[]}function i(e){switch(e.length){case 0:return r;case 1:return"auto"===t?e[0]:e;default:return e}}function o(e){return!e}function u(e,t){return function(r){r=a(r);var n=v(r,e);return t===!0?0===h(n,o).length:i(n)}}function s(e){return function(t,r){var n=a(t),i=a(r);if(n.length!==i.length)return!1;for(var o=0;o<n.length;o++)if(!e(n[o],i[o]))return!1;return!0}}this.encode=u(n(e,"encode")),this.decode=u(n(e,"decode")),this.is=u(n(e,"is"),!0),this.equals=s(n(e,"equals")),this.pattern=e.pattern,this.$normalize=u(n(e,"$normalize")),this.name=e.name,this.$arrayMode=t}if(!e)return this;if("auto"===e&&!t)throw new Error("'auto' array mode is for query parameters only");return new n(this,e)},t.module("ui.router.util").provider("$urlMatcherFactory",y),t.module("ui.router.util").run(["$urlMatcherFactory",function(){}]),w.$inject=["$locationProvider","$urlMatcherFactoryProvider"],t.module("ui.router.router").provider("$urlRouter",w),b.$inject=["$urlRouterProvider","$urlMatcherFactoryProvider"],t.module("ui.router.state").value("$stateParams",{}).provider("$state",b),E.$inject=[],t.module("ui.router.state").provider("$view",E),t.module("ui.router.state").provider("$uiViewScroll",S),x.$inject=["$state","$injector","$uiViewScroll","$interpolate"],P.$inject=["$compile","$controller","$state","$interpolate"],t.module("ui.router.state").directive("uiView",x),t.module("ui.router.state").directive("uiView",P),C.$inject=["$state","$timeout"],q.$inject=["$state","$stateParams","$interpolate"],t.module("ui.router.state").directive("uiSref",C).directive("uiSrefActive",q).directive("uiSrefActiveEq",q),k.$inject=["$state"],I.$inject=["$state"],t.module("ui.router.state").filter("isState",k).filter("includedByState",I)}(window,window.angular);