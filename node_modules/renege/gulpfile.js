/*eslint no-invalid-this: 0*/
var
	coveralls = require('gulp-coveralls'),
	del = require('del'),
	eslint = require('gulp-eslint'),
	gulp = require('gulp'),
	gulpUtil = require('gulp-util'),
	istanbul = require('gulp-istanbul'),
	mocha = require('gulp-mocha');


module.exports = (function () {
	'use strict';

	gulp.task('clean', function () {
		return del('coverage', 'reports');
	});

	gulp.task('coveralls', function () {
		return gulp
			.src('./reports/lcov.info')
			.pipe(coveralls());
	});

	gulp.task('lint', function () {
		return gulp
			.src(['**/*.js', '!node_modules/**', '!reports/**'])
			.pipe(eslint())
			.pipe(eslint.format())
			.pipe(eslint.failAfterError());
	});

	gulp.task('test', ['clean', 'lint', 'test-unit']);

	gulp.task('test-unit', ['clean'], function () {
		return gulp
			.src(['./promise.js'])
			.pipe(istanbul())
			.pipe(istanbul.hookRequire())
			.on('finish', () => {
				return gulp
					.src(['./test/promise.js'])
					.pipe(mocha({ reporter : 'spec' })
						.on('error', function (err) {
							if (err.showStack) {
								gulpUtil.log(err);
							}

							return this.emit('end');
						}))
					.pipe(istanbul.writeReports('./reports'));
			});
	});
}());
