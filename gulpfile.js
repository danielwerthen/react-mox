var gulp = require('gulp');
var jest = require('jest-cli');
var del = require('del');
var jestConfig = require('./package.json').jest;
var tempDir = 'test-build';

//make sure that the test end up in our tempDir
jestConfig.rootDir = tempDir;
//no need for a script preprocessor as we run jsx before the testing
delete jestConfig.scriptPreprocessor;

gulp.task('test', [ 'transform' ],  function (done) {
  jest.runCLI({ config: jestConfig }, ".", function () {
    del([
      jestConfig.rootDir
    ], done);
  });
});

var react = require('gulp-react');

gulp.task('transform', function () {
  return gulp.src(['./examples/**/*.js', './src/**/*.js'])
    .pipe(react())
    .pipe(gulp.dest(jestConfig.rootDir));
});

gulp.task('tdd', function (done) {
  gulp.watch([ "./examples/**/*.js", "./src/**/*.js" ], [ 'test' ]);
});


