/*eslint no-magic-numbers:0*/
/*eslint no-unused-expressions:0*/
var
	chai = require('chai'),
	chaiAsPromised = require('chai-as-promised'),

	renege = require('../promise'),

	should = chai.should();


describe('renege', function () {
	'use strict';

	var
		mockErrorMethod = function (message, callback) {
			return setImmediate(callback, new Error(message));
		},
		mockSuccessMethod = function (val, callback) {
			return setImmediate(function () {
				return callback(null, val);
			});
		};

	// hookup chai-as-promised
	chai.use(chaiAsPromised);

	describe('#create', function () {
		it('should require arguments', function () {
			should.exist(renege);
			should.exist(renege.create);
			renege.create.should.throw(/required/);
		});

		it('should properly convert to a promise', function () {
			renege
				.create(mockSuccessMethod, 'testing')
				.should
				.eventually
				.equal('testing');

			renege
				.create(mockErrorMethod, 'error testing')
				.should
				.be
				.rejectedWith(/error testing/);
		});
	});

	describe('#promisify', function () {
		it('should require arguments', function () {
			should.exist(renege);
			should.exist(renege.promisify);
			renege.promisify.should.throw(/required/);
		});

		it('should properly covert to a closure that returns a Promise', function () {
			var
				error = renege.promisify(mockErrorMethod),
				success = renege.promisify(mockSuccessMethod);

			error.should.be.a.function;
			error('error testing').should.eventually.be.rejectedWith(/error testing/);

			success.should.be.a.function;
			success('testing').should.eventually.equal('testing');
		});
	});

	describe('#series', function () {
		it('should require a list of functions', function () {
			should.exist(renege);
			should.exist(renege.series);

			renege.series().should.be.rejectedWith(/required/);
		});

		it('should require that each item in the list is a function', function () {
			var badList = [
				function () {
					return Promise.resolve(1);
				},
				Promise.resolve(2)];

			return renege.series(badList).should.be.rejectedWith(/index 1/);
		});

		it('should resolve immediately if list is empty', function () {
			renege.series([]).should.eventually.resolve;
		});

		it('should reject immediately when a promise within the array rejects', function () {
			var
				counter = 0,
				list = [
					function () {
						return renege.create(function (callback) {
							counter++;

							return setImmediate(callback);
						});
					},
					function () {
						return renege.create(mockErrorMethod, 'test error');
					},
					function () {
						return renege.create(function (callback) {
							counter++;

							return setImmediate(callback);
						});
					}
				];

			renege.series(list)
				.should.be.rejectedWith(/test error/)
				.notify(function () {
					counter.should.equal(1);
				});
		});

		it('should resolve in order after all Promises resolve', function () {
			var
				debug = [],
				list = [
					function () {
						return new Promise(function (resolve) {
							debug.push(1);
							return resolve();
						});
					},
					function () {
						return new Promise(function (resolve) {
							debug.push(2);
							return resolve();
						});
					},
					function () {
						return new Promise(function (resolve) {
							debug.push(3);
							return resolve();
						});
					}
				];

			renege.series(list).should.be.fulfilled.notify(function () {
				debug.should.equal([1, 2, 3]);
			});
		});
	});
});
