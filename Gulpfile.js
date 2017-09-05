var gulp = require('gulp'),
copy = require("gulp-copy"),
sass = require('gulp-sass'),
gutil = require('gulp-util'),
runSequence  = require('run-sequence'),
sourcemaps = require('gulp-sourcemaps'),
webpackConfig = require('./webpack.config.js'),
webpack = require('webpack'),
webpackStream = require('webpack-stream'),
webpackDevServer = require("webpack-dev-server");

// Main tasks
gulp.task('default', function(done) { runSequence('sass', 'copy_bundle', 'copy_html','webpack_stream', 'launch_server'); });
gulp.task('dev', function(done) { runSequence('watch', 'launch_server'); });

gulp.task('sass', function () {
  return gulp.src('src/sass/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/css/'));
});

gulp.task('copy_bundle', function() {
 return gulp.src([
    'src/client/public/**/*' ], 
    {base: 'src/client/public'}) 
    .pipe(gulp.dest('build/public'));
});

gulp.task('copy_html', function() {
 return gulp.src([
    'src/client/index.html' ], 
    {base: 'src/client'}) 
    .pipe(gulp.dest('build'));
});

gulp.task('webpack_stream', function(){
    var watch = Object.create(webpackConfig);
    return gulp.src('./src/client/app/index.jsx')
        .pipe(webpackStream(watch))
        .pipe(gulp.dest('./build/public'));
});

gulp.task("launch_server", function(callback) {
    var myConfig = Object.create(webpackConfig);
    myConfig.devtool = "eval";
    // Start a webpack-dev-server
    console.log("PATH: " + myConfig.output.publicPath);
    new webpackDevServer(webpack(myConfig), {
        contentBase: myConfig.output.publicPath,
        stats: {
            colors: true
        }
    }).listen(8080, "localhost", function(err) {
        if(err) throw new gutil.PluginError("webpack-dev-server", err);
        gutil.log("[webpack-dev-server]", "http://localhost:8080/index.html");
    });
});


//Watch task
gulp.task('watch', function () {
  gulp.watch('src/sass/**/*', ['sass'] );
  gulp.watch('src/client/public/**/*', ['copy_bundle'] );
  gulp.watch('src/client/index.html', ['copy_html'] );
  gulp.watch('src/client/app/index.jsx', ['webpack_stream'] );
});