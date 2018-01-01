/**
 * Gulpfile
 * Contains build tasks
 */

const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const minify = require('gulp-minify');
const sequence = require('run-sequence');
const bulkSass = require('gulp-sass-bulk-import');
const buildTools = require('./build/build');

const jsPaths = [
  './assets/js/libs/**/*',
  './assets/js/app/**/*',
  './assets/js/core/*',
  './assets/js/modules/**/*',
  './assets/js/widgets/**/*'
];

const sassPaths = [
  './assets/sass/app/*',
  './assets/sass/core/*',
  './assets/sass/libs/**/*',
  './assets/sass/modules/**/*',
  './assets/sass/widgets/**/*'
];

// compile all sass files
gulp.task('sass', () => {
  'use strict';
  return gulp.src('./assets/sass/style.scss')
    .pipe(bulkSass())
    .pipe(sourcemaps.init())
    .pipe(sass(
      {outputStyle: 'compressed'}
    ).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 5 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./assets/css/'));
});

// watch js/sass files and re-compile on save
gulp.task('app:watch', (done) => {
  'use strict';
  sequence(['sass:watch', 'js:watch'], done);
});

// watch sass files and re-compile on save
gulp.task('sass:watch', () => {
  'use strict';
  gulp.watch(sassPaths, ['sass']);
});

// watch js files and re-concatenate on save
gulp.task('js:watch', () => {
  'use strict';
  gulp.watch(jsPaths, ['js:concat']);
});

// concatenate all js files
gulp.task('js:concat', () => {
  'use strict';
  return gulp.src(jsPaths)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat('main.js', {
      newLine: '\n;'
    }))
    .pipe(gulp.dest('./assets/js/'));
});

// minify js file
gulp.task('js:minify', () => {
  'use strict';
  gulp.src('./assets/js/main.js')
    .pipe(minify({
      ext: {
        src: '.js',
        min: '.min.js'
      }
    }))
    .pipe(gulp.dest('./assets/js/'));
});

// create module files
gulp.task('module', () => {
  'use strict';

  const appName = process.argv[4];
  const moduleName = process.argv[6];

  if (!appName || !moduleName) {
    return console.error('Invalid arguments. Make sure to pass an app name and module name.');
  }

  buildTools.createModule(appName, moduleName);
});

// create widget files
gulp.task('widget', () => {
  'use strict';

  const appName = process.argv[4];
  const widgetName = process.argv[6];

  if (!appName || !widgetName) {
    return console.error('Invalid arguments. Make sure to pass an app name and widget name.');
  }

  buildTools.createWidget(appName, widgetName);
});
