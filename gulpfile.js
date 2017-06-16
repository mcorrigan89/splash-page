let gulp = require('gulp');
let sass = require('gulp-sass');
let rename = require('gulp-rename');
let sequence = require('run-sequence');
let minifyCSS = require('gulp-clean-css');
let sourcemaps = require('gulp-sourcemaps');
let concatCss = require('gulp-concat-css');
let gls = require('gulp-live-server');
let clean = require('gulp-clean');

gulp.task('clean', () => {
    return gulp.src('dist/', {
            read: false
        })
        .pipe(clean());
});

gulp.task('sass', () => {
    return gulp.src('./src/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        .pipe(concatCss("/styles.css"))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest('./docs'));
});

gulp.task('html', () => {
    return gulp.src('./src/index.html')
        .pipe(gulp.dest('./docs'));
});

gulp.task('assets', () => {
    return gulp.src('./src/assets/**/*')
        .pipe(gulp.dest('./docs/assets'));
});

gulp.task('server:watch', () => {
    gulp.watch(['./src/**/*.scss'], ['sass']);
    gulp.watch(['./src/**/*.html'], ['html']);
});

gulp.task('server:start', () => {
    let server = gls.static(['docs'], 8080);
    server.start();
});

gulp.task('build', (done) => {
    sequence(
        'html',
        'sass',
        'assets'
    );
});

gulp.task('server', (done) => {
    sequence(
        'html',
        'sass',
        'assets',
        'server:watch',
        'server:start',
        done
    );
});