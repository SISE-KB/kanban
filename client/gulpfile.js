var gulp = require('gulp');
//var templateCache = require('gulp-angular-templatecache');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var merge = require('merge-stream');
var rimraf = require('rimraf');

  

gulp.task('build-comm-js', function () {
  return  gulp.src('src/common/**/*.js')
    .pipe(concat('app-common.js'))
    .pipe(gulp.dest('dist'));
});
gulp.task('build-app-js', function () {
  return  gulp.src('src/app/**/*.js')
    .pipe(concat('app-main.js'))
    .pipe(gulp.dest('dist'));
});
gulp.task('copy-static', function () {
  return merge(
    gulp.src('css/*.*').pipe(gulp.dest('dist/css')),
    gulp.src('fonts/*').pipe(gulp.dest('dist/fonts')),
    gulp.src('src/*.*').pipe(gulp.dest('dist')),
    merge(
      gulp.src('assets/**/*.*'),
   /*   gulp.src(['libs/angular.js', 'libs/angular-ui-router.js','libs/angular-messages.js'
       ,'libs/angular-aria.js','libs/angular-animate.js' 
       ,'libs/angular-sanitize.js'
       ,'libs/angular-locale_zh-cn.js'])
	  .pipe(concat('angular.js'))*/
	  gulp.src('libs/angular-ext/*.js').pipe(concat('my-angular-ext.js')) ,
	  gulp.src('libs/calendar/*.js').pipe(concat('my-calendar.js')) .pipe(uglify()),
	  gulp.src('libs/*.js').pipe(uglify())
	).pipe(gulp.dest('dist')),
     /* ,gulp.src('libs/ui-bootstrap-tpls.min.js'),
      gulp.src('libs/ui-select.js'),
      gulp.src('libs/marked.js'),
      gulp.src('libs/angular-marked.js'),
      gulp.src('libs/Sortable.js'),
      gulp.src('libs/ng-sortable.js'),
      gulp.src('libs/ng-droplet.js'),
	  gulp.src('libs/fullcalendar.min.js'),
	  gulp.src('libs/calendar.js')
   )*/

   merge(
      gulp.src('src/common/**/*.tpl.html'),
      gulp.src('src/app/**/*.tpl.html')
   ).pipe(gulp.dest('dist/views'))
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


gulp.task('watch', ['lint', 'build'], function () {

  gulp.watch('src/**/*.js', ['lint', 'build-js']);
  gulp.watch('src/**/*.tpl.html', ['build-js']);
  gulp.watch('src/assets/**/*.*', ['copy-static']);

});
gulp.task('build-js', ['build-comm-js', 'build-app-js']);
gulp.task('build', ['copy-static', 'build-js']);
gulp.task('default', ['build']);


