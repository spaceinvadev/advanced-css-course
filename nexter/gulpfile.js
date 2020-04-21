// Initialize the modules
const { src, dest, watch, series, parallel } = require('gulp');
const autoprefixer = require('autoprefixer');
const  cssnano = require('cssnano');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const sourceMaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

// File path variables
const files = {
  scssPath: 'src/sass/**/*.scss',
  jsPath: 'src/js/**/*.js',
  cssPath: 'dist/styles',
};

// Sass task
function compileSass() {
  return src(files.scssPath)
    .pipe( sourceMaps.init() )
    .pipe( sass() )
    .pipe( postcss([ autoprefixer(), cssnano() ]) )
    .pipe( sourceMaps.write('.') )
    .pipe( dest( files.cssPath )
  );
}

// JS task
function jsTask() {
  return src(files.jsPath)
    .pipe( concat('all.js') )
    .pipe( uglify() )
    .pipe( dest('dist')
  );
}

// Cachebusting task
function cacheBustTask() {
  const cbString = new Date().getTime();

  return src( ['index.html'] )
    .pipe( replace(/cb=\d+/g, 'cb=' + cbString) )
    .pipe( dest('.')
  );
}

// Watch task
function watchTask() {
  watch(
    [files.scssPath, files.jsPath],
    parallel( compileSass, jsTask )
  );
}

// Default task
exports.default = series(
  parallel( compileSass, jsTask ),
  cacheBustTask,
  watchTask
);

// TODO: Add browserSync