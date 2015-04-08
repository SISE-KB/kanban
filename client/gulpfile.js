var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    fs = require('fs'),
    karma = require('karma').server,
    path = require('path');

var express = require('express'),
    http = require('http'),
    server = http.createServer(express().use(express.static(__dirname + '/test/e2e/app/')));
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/test", function(err) {
  if (err) {
    console.log(' connection error. ', err);
    throw(err);
  } else /*if(process.env.NODE_ENV === 'development')*/{
    console.log( 'mongodb connected.');
  }
});
var files=['models/*.js','test/unit/*.js'];
gulp.task('jshint', function () {
  gulp.src(files)
    .pipe($.jshint())
    .pipe($.jshint.reporter('default'));
});

gulp.task('js', ['jshint'], function () {
  return gulp.src('js/**/*.js')
    .pipe($.plumber())
    .pipe($.concat('myApp.js'))
    .pipe(gulp.dest('dist'))
    .pipe($.uglify({ mangle: false }))
    .pipe($.rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist'));
});



gulp.task('test', function () {
  karma.start({
    configFile: path.join(__dirname, 'test/karma.conf.js'),
     // browsers: ['PhantomJS'],
      reporters: ['progress', 'coverage'],
    singleRun: true
  }, function (code) {
    console.info('[Karma] exited with ', code);
    if (!process.env.TRAVIS) { return code; }
    console.info('[Coverage] Launching...');
    gulp.src('test/coverage/**/lcov.info')
      .pipe($.coveralls())
      .on('end', function() {
        process.exit(code);
      });
  });
});


gulp.task('e2e:server', function (callback) {
  server.listen(8001, callback);
});

gulp.task('e2e:run', ['e2e:server'], function (callback) {
  gulp.src('test/e2e/*.js')
    .pipe($.protractor.protractor(
      {
        configFile: 'test/protractor.conf.js',
        args: ['--baseUrl', 'http://' + server.address().address + ':' + server.address().port]
      }
    )).on('error', function (e) {
      server.close();
      callback(e);
    }).on('end', function () {
      server.close();
      callback();
    });
});

gulp.task('e2e:update', function () {
  $.protractor.webdriver_update();
});

gulp.task('watch', function () {
  gulp.watch('js/**/*.js', ['js']);
});

gulp.task('default', ['js',  'watch']);
