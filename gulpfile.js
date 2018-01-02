/**
 * Gulpfile
 * Contains build tasks
 */

const fs = require('fs');
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
const rename = require('gulp-rename');
const trimLines = require('gulp-trimlines');
const liveReload = require('gulp-livereload');

// define js paths
const jsPaths = [
  './assets/js/libs/**/*',
  './assets/js/app/**/*',
  './assets/js/core/*',
  './assets/js/modules/**/*',
  './assets/js/widgets/**/*'
];

// define sass paths
const sassPaths = [
  './assets/sass/app/*',
  './assets/sass/core/*',
  './assets/sass/libs/**/*',
  './assets/sass/modules/**/*',
  './assets/sass/widgets/**/*'
];

// watch js/sass files and re-compile on save
gulp.task('app:watch', done => {
  'use strict';
  liveReload.listen();
  sequence(['sass:watch', 'js:watch'], done);
});

// watch sass files and re-compile on save
gulp.task('sass:watch', () => {
  'use strict';
  gulp.watch(sassPaths, ['sass:preprocess']);
});

// watch js files and re-concatenate on save
gulp.task('js:watch', () => {
  'use strict';
  gulp.watch(jsPaths, ['js:concat']);
});

// compile all sass files
gulp.task('sass:preprocess', () => {
  'use strict';

  gulp.src('./assets/sass/style.scss')
    .pipe(bulkSass())
    .pipe(sourcemaps.init())
    .pipe(sass(
      {outputStyle: 'expanded'}
    ).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 5 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./assets/css/'))
    .pipe(liveReload());
});

// concatenate all js files
gulp.task('js:concat', () => {
  'use strict';
  gulp.src(jsPaths)
    .pipe(trimLines())
    .pipe(sourcemaps.init())
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(concat('main.js', {
      newLine: '\n;'
    }))
    .pipe(gulp.dest('./assets/js/'))
    .pipe(liveReload());
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

// create distributable package
gulp.task('app:dist', done => {
  'use strict';

  sequence([
    'dist:js',
    'dist:sass',
    'dist:img',
    'dist:fonts',
    'dist:html'
  ], done);
});

// distribute scripts
gulp.task('dist:js', () => {
  'use strict';

  gulp.src('./assets/js/main.js')
    .pipe(minify({
      ext: { min: '.min.js' },
      noSource: true
    }))
    .pipe(gulp.dest('./dist/assets/js/'));
});

// distribute styles
gulp.task('dist:sass', () => {
  'use strict';

  gulp.src('./assets/sass/style.scss')
    .pipe(bulkSass())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 5 versions'],
      cascade: false
    }))
    .pipe(rename(path => path.extname = '.min.css'))
    .pipe(gulp.dest('./dist/assets/css'));
});

// distribute images
gulp.task('dist:img', () => {
  'use strict';

  gulp.src('./assets/img/**/*.{png,gif,jpg}*')
    .pipe(gulp.dest('./dist/assets/img/'));
});

// distribute fonts
gulp.task('dist:fonts', () => {
  'use strict';

  gulp.src('./assets/fonts/**/*.{otf,eot,svg,ttf,woff,woff2}', { base: '.' })
    .pipe(gulp.dest('./dist/'));
});

// distribute html
gulp.task('dist:html', () => {
  'use strict';

  fs.readFile('./index.html', 'utf-8', (err, content) => {
    content = content
      .replace('main.js', `main.min.js`)
      .replace('style.css', `style.min.css`);

    fs.writeFile('./dist/index.html', content, (err) => {
      if (err) {
        return console.log(err);
      }
    });
  });
});
