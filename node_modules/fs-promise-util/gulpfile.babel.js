import babel from 'gulp-babel';
import coveralls from 'gulp-coveralls';
import del from 'del';
import eslint from 'gulp-eslint';
import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';

gulp.task('clean', () => {
	return del([
		'dist'
	]);
});

gulp.task('build', ['clean'], () => {
	return gulp.src('src/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'));
});

gulp.task('clean-reports', () => {
	return del('reports', { force : true });
});

gulp.task('coveralls', function () {
	return gulp
		.src('reports/lcov.info')
		.pipe(coveralls());
});

gulp.task('lint', () => {
	return gulp
		.src(['gulpfile.babel.js', 'src/**/*.js', 'test/**/*.js'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});
