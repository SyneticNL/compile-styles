/*
An extensive task to compile SCSS files

Settings object:
{
  source: [],
  dest: dest,
  ignore: [`${pattern}*`],
  "browsersupport": [
    "> 1%",
    "last 2 versions",
    "IE 9"
  ],
  "minify": false,
  "gzip": false,
  "compass": false,
  "exclude": [],
  "sourcemaps": {
    "enable": true,
    "location": "/",
    "settings": {
      "init": {},
      "write": {
        "addcomment": true,
        "destpath": ""
      }
    }
  },
  "flatten": true,
  "pxtorem": {
    "enabled": true,
    "settings": {
      "rootValue": 16,
      "replace": false
    }
  }
}

 */

const
    gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),  // Adds prefixes to css files
    browserSync = require('browser-sync').create(), // Run synchronized server
    bytediff = require('gulp-bytediff'), // Size difference before and after alteration
    compass = require('compass-importer'), // Add ability for compass mixins
    filter = require('gulp-filter'), // Filter stream
    flatten = require('gulp-flatten'),
    gulpif = require('gulp-if'), // Conditional tasks
    gzip = require('gulp-gzip'), // gZip CSS & JavaScript
    multiDest = require('gulp-multi-dest'),
    nano = require('gulp-cssnano'), // Minifies css
    plumber = require('gulp-plumber'), // Error Handling
    postcss = require('gulp-postcss'),
    pxtorem = require('postcss-pxtorem'),
    rename = require('gulp-rename'), // Rename files
    sass = require('gulp-sass'), // Sass compiler
    sassGlob = require('gulp-sass-glob'), // Enables @import folder functionality in Sass
    sizereport = require('gulp-sizereport'), // Create an sizereport for your project
    sourcemaps = require('gulp-sourcemaps'); // Creates sourcemaps in css files

stringToArray = require('./scripts/stringToArray');

module.exports = (config) => {
    config.dest = stringToArray(config.dest);
    const onError = function (err) {
        error(err, 'Styles');
    };
    const filter_sourcemaps = filter(['**/*', '!**/*.map'], {restore: true});
    let excludeFiles = config.exclude;
    excludeFiles.unshift('**/*');
    const filter_exclude = filter(excludeFiles, {restore: false});
    const excludeSubfiles = filter(["**/*","!**/+*.scss","!**/~*.scss"], {restore: false});
    return gulp.src(config.source)
        .pipe(excludeSubfiles)
        .pipe(filter_exclude)
        .pipe(sassGlob({ignorePaths: config.ignore}))
        .pipe(plumber({errorHandler: onError}))
        .pipe(gulpif(config.sourcemaps.enable === true, sourcemaps.init(config.sourcemaps.settings.init)))
        .pipe(gulpif(config.compass !== true, sass()))
        .pipe(gulpif(config.compass === true, sass({importer: compass}).on('error', sass.logError)))
        .pipe(autoprefixer({
            browsers: config.browsersupport,
            cascade: false
        }))
        .pipe(gulpif(config.pxtorem.enabled, postcss([
            pxtorem(config.pxtorem.settings)
        ])))
        .pipe(gulpif(config.sourcemaps.enable === true,
            sourcemaps.write(config.sourcemaps.location, {
                ...config.sourcemaps.settings.write,
                sourceRoot: function (file) {
                    return '../'.repeat(file.relative.split('\\').length) + 'src';
                }
            })
        ))
        .pipe(gulpif(config.flatten, flatten()))
        .pipe(multiDest(config.dest))
        .pipe(filter_sourcemaps)
        .pipe(gulpif(config.minify === true, bytediff.start()))
        .pipe(gulpif(config.minify === true, nano()))
        .pipe(gulpif(config.minify === true, rename(function (path) {
            path.basename += '.min';
        })))
        .pipe(gulpif(config.minify === true, multiDest(config.dest)))
        .pipe(gulpif(config.minify === true, bytediff.stop()))
        .pipe(gulpif(config.gzip === true, bytediff.start()))
        .pipe(gulpif(config.gzip === true, gzip()))
        .pipe(gulpif(config.gzip === true, multiDest(config.dest)))
        .pipe(gulpif(config.gzip === true, bytediff.stop()))
        .pipe(sizereport({gzip: true}))
        .pipe(filter_sourcemaps.restore)
        .pipe(plumber.stop())
        .pipe(browserSync.stream())
        .pipe(plumber())
        .pipe(plumber.stop());
};