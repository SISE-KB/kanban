var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
//var template = require('gulp-template');
//var header = require('gulp-header');
//var htmlmin = require('gulp-htmlmin');
var protractor = require("gulp-protractor").protractor;

var merge = require('merge-stream');
var rimraf = require('rimraf');
var _ = require('lodash');

var karma = require('karma').server;

var package = require('./package.json');

var karmaCommonConf = {
  browsers: process.env.TRAVIS ? ['SL_Chrome', 'SL_Firefox', 'SL_Safari', 'SL_IE_11'] : ['Chrome'],
  customLaunchers: {
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Linux',
      version: '36'
    },
    'SL_Firefox': {
      base: 'SauceLabs',
      browserName: 'firefox',
      platform: 'Linux',
      version: '31'
    },
    'SL_Safari': {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.9',
      version: '7'
    },
    'SL_IE_11': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 8.1',
      version: '11'
    }
  },
  frameworks: ['jasmine'],
  preprocessors: {
    'src/**/*.tpl.html': ['ng-html2js']
  },
  files: [
    'libs/jquery.js',
    'libs/angular.js',
    'libs/angular-route.js',
    'libs/angular-mocks.js',
    'libs/angular-sanitize.js',
    'libs/ui-bootstrap-tpls.js',
    'libs/ui-select.js',
    'src/**/*.tpl.html',
    'src/**/*.js',
    'test/unit/**/*.spec.js'
  ],
  reporters: process.env.TRAVIS ? ['dots'] : ['progress'],
  ngHtml2JsPreprocessor: {
    cacheIdFromPath: function(filepath) {
      //cut off src/common/ and src/app/ prefixes, if present
      //we do this so in directives we can refer to templates in a way
      //that those templates can be served by a web server during dev time
      //without any need to bundle them
      return filepath.replace('src/common/', '').replace('src/app/', '');
    }
  }
};

var htmlMinOpts = {
    collapseWhitespace: true,
    conservativeCollapse: true
  };
  

gulp.task('build-app-temps', function () {
	 return    gulp.src('src/app/**/*.tpl.html')
      .pipe(templateCache({standalone: true, module: 'templates.app'}))
      .pipe(concat('templates-app.js'))
     .pipe(gulp.dest('dist'));
});
gulp.task('build-common-temps', function () {

	 return    gulp.src('src/common/**/*.tpl.html')
	 //.pipe(htmlmin(htmlMinOpts))
      .pipe(templateCache({standalone: true, module: 'templates.common'}))
      .pipe(concat('templates-common.js'))
     .pipe(gulp.dest('dist'));
});

gulp.task('build-comm-js', function () {
  return  gulp.src('src/common/**/*.js')
    .pipe(concat('angular-common.js'))
    .pipe(gulp.dest('dist'));
});
gulp.task('build-app-js', function () {
  return  gulp.src('src/app/**/*.js')
    .pipe(concat('angular-app.js'))
    .pipe(gulp.dest('dist'));
});
gulp.task('copy-static', function () {
  return merge(
    gulp.src('css/*.*').pipe(gulp.dest('dist/css')),
    gulp.src('fonts/*').pipe(gulp.dest('dist/fonts')),
    gulp.src('src/*.*').pipe(gulp.dest('dist')),
    merge(
      gulp.src('src/assets/**/*.*'),
      gulp.src(['libs/angular.js', 'libs/angular-route.js','libs/angular-locale_zh-cn.js', 'libs/angular-sanitize.js'])
	  .pipe(concat('angular.js'))
	  .pipe(uglify()),
      gulp.src('libs/ui-bootstrap-tpls.js'),
      gulp.src('libs/ui-select.js'),
      gulp.src('libs/jquery.js')
   )
   .pipe(gulp.dest('dist'))
  );
});

gulp.task('clean', function (done) {
  return rimraf('dist', done);
});

gulp.task('lint', function () {
  return gulp.src(['src/**/*.js', 'test/unit/**/*.js']).pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('test', function (done) {
  karma.start(_.assign({}, karmaCommonConf, {singleRun: true}), done);
});

gulp.task('tdd', function (done) {
  karma.start(karmaCommonConf, done);
});

gulp.task('e2e', function() {
  return gulp.src(['./test/e2e/**/*.js'], false)
            .pipe(protractor({ configFile: 'test/protractor.conf.js' }));
});

gulp.task('watch', ['lint', 'build'], function () {

  gulp.watch('src/**/*.js', ['lint', 'build-js']);
  gulp.watch('src/**/*.tpl.html', ['build-js']);
  gulp.watch('src/assets/**/*.*', ['copy-static']);

});
gulp.task('build-js', ['build-common-temps', 'build-app-temps', 'build-comm-js', 'build-app-js']);
gulp.task('build', ['copy-static', 'build-js']);
gulp.task('all', ['lint', 'test', 'build']);
gulp.task('default', ['build']);


