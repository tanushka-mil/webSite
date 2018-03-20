const gulp = require('gulp');
const watch = require('gulp-watch');
const less = require('gulp-less');
const path = require('path');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');


gulp.task('less', () => {
    return gulp.src('./src/styles/styles.less')
        .pipe(sourcemaps.init())
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./src/styles'))
});

gulp.task('lessFinal', () => {
    return gulp.src('./src/styles/styles.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./build/styles'))
});


gulp.task('script', () =>
    gulp.src(['./src/scripts/*.js', '!./src/scripts/script.js'])
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./src/scripts/'))
);

gulp.task('scriptFinal', () =>
    gulp.src(['./src/scripts/*.js', '!./src/scripts/script.js'])
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/scripts/'))
);



gulp.task('copied', () => {
    gulp.src('./src/index.html').pipe(gulp.dest('./build'));
    gulp.src('./src/images/favicon/*').pipe(gulp.dest('./build/images/favicon'))
});


gulp.task('development', () => {
    gulp.watch('./src/scripts/*.js', ['script']);
    gulp.watch('./src/styles/styles.less', ['less']);
    gulp.watch('./src/index.html', ['copied']);
});
