'use strict';

const gulp = require('gulp'),
      notify = require('gulp-notify'),
      reporter = require('postcss-browser-reporter'),
      eslint = require('gulp-eslint'),
      stylelint = require('stylelint'),
      browserSync = require('browser-sync').create(),
      postcss = require('gulp-postcss'),
      nested = require('postcss-nested'),
      assets = require('postcss-assets'),
      short = require('postcss-short'),
      autoprefixer = require('gulp-autoprefixer'),
      rimraf = require('rimraf'),
      csso = require('gulp-csso'),
      pug = require('gulp-pug'),
      replace = require('gulp-replace'),
      svgmin = require('gulp-svgmin'),
      cheerio = require('gulp-cheerio'),
      svgSprite = require('gulp-svg-sprite'),



gulp.task('styles', function() {

    var processors = [

        stylelint(),
        nested,
        short,
        assets,
        reporter({
            selector: 'body:before'
        })
    ];

    return gulp.src('./source/css/main.css')
        .pipe(postcss(processors)).on('error', notify.onError({ title: 'Style' }))
        .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
        .pipe(gulp.dest('./build/assets/css/'))
        .pipe(browserSync.stream());
});

gulp.task('normalize', () => {
    return gulp.src('./source/css/normalize.css')
        .pipe(csso())
        .pipe(gulp.dest('./build/assets/css/'))
});

gulp.task('pug', () => {
    return gulp.src('./source/page/*.pug')
        .pipe(pug({ pretty: true }))
        .on('error', notify.onError(function(error) {
            return {
                title: 'Pug',
                message: error.message
            }
        }))
        .pipe(gulp.dest('./build/'))
});

gulp.task('copyFonts', () => {
    return gulp.src('./source/fonts/**/*.*', { since: gulp.lastRun('copyFonts') })
        .pipe(gulp.dest('./build/assets/fonts'))
});

gulp.task('copyImages', () => {
    return gulp.src('./source/images/**/*.*', { since: gulp.lastRun('copyImages') })
        .pipe(gulp.dest('./build/assets/images'))
});

gulp.task('esLint', () => {
    return gulp.src('./source/js/main.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .on('error', notify.onError({
            message: "JS Debug Mode ON, fix it please"
        }));

});

gulp.task('js', () => {
    return gulp.src('./source/js/main.js')
        .pipe(gulp.dest('./build/assets/js'))
});

gulp.task('serve', () => {
    browserSync.init({
        open: false,
        server: './build'
    });
    browserSync.watch(['./build' + '/**/*.*', '!**/*.css'], browserSync.reload);
});

gulp.task('clean', cb => {
    return rimraf('./build', cb);
});

gulp.task('sprite:svg', () => {
    let svgminConfig = { js2svg: { pretty: true } };

    let cheerioConfig = {
        run: function($) {
            $('[fill]').removeAttr('fill');
            $('[stroke]').removeAttr('stroke');
            $('[style]').removeAttr('style');
        },
        parserOptions: { xmlMode: true }
    };

    let svgSpriteConfig = {
        mode: {
            symbol: {
                sprite: "../sprite.svg"
            }
        }
    };

    return gulp.src('./source/icons/*svg')
        .pipe(svgmin(svgminConfig))
        .pipe(cheerio(cheerioConfig))
        .pipe(replace('&gt;', '>'))
        .pipe(svgSprite(svgSpriteConfig))
        .pipe(gulp.dest('./build/assets/sprite'))
});

gulp.task('watch', () => {
    gulp.watch('./source/js/**/*.js', gulp.series('js', 'esLint'));
    gulp.watch('./source/css/**/*.css', gulp.series('styles'));
    gulp.watch('./source/page/**/*.pug', gulp.series('pug'));
    gulp.watch('./source/images/**/*.*', gulp.series('copyImages'));
    gulp.watch('./source/fonts/**/*.*', gulp.series('copyFonts'));
});

gulp.task('default', gulp.series(
    'clean', 'sprite:svg',
    gulp.parallel(
        'styles',
        'normalize',
        'pug',
        'js',
        'esLint',
        'copyFonts',
        'copyImages'),
    gulp.parallel(
        'watch',
        'serve'
    )
));
