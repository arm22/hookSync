module.exports = (function (self) {
	'use strict';

	/**
	 * A convenience method for creating Promise objects from
	 * traditional node asynchronous methods involving a callback
	 * but when the arguments for the function are known at ahead
	 * of time.
	 * @param {*} arguments - A callback function followed by any arguments for the function
	 * @returns {Promise} A new Promise from the input
	 **/
	self.create = function () {
		var
			args = Array.prototype.slice.call(arguments),
			method = args[0];

		if (!args.length) {
			throw new Error('method to convert to a Promise is required');
		}

		return new Promise(function (resolve, reject) {
			return method.apply(null, args.slice(1).concat(function () {
				var
					args = Array.prototype.slice.call(arguments),
					err = args[0];

				if (err) {
					return reject(err);
				}

				return resolve.apply(null, args.slice(1));
			}));
		});
	};

	/**
	 * Returns a closure that builds a promise for a typical node function
	 * that accepts a callback(err, [...]) as a final argument, but allows
	 * function arguments to be late-bound and applied at run time.
	 * @param {function} callback - A function that accepts a traditional callback as the last argument
	 * @returns {function} A closure that returns a new Promise from the input
	 **/
	self.promisify = function (callback) {
		if (!callback) {
			throw new Error('method to convert to a Promise is required');
		}

		return function () {
			var args = Array.prototype.slice.call(arguments);
			args.unshift(callback);

			return self.create.apply(null, args);
		};
	};

	/**
	 * Returns a Promise that resolves a list of closures (where each closure
	 * returns a Promise) in series order.
	 * @param {function[]} list - A list of closures that each return a Promise
	 * @returns {Promise} A Promise that resolves once each item within the input list is resolved
	 **/
	self.series = function (list) {
		var err;

		if (!list || !Array.isArray(list)) {
			return Promise.reject(
				new Error('list of functions that return a Promise is required'));
		}

		// validate that each item in the input list is a function
		list.some(function (closure, index) {
			if (typeof closure !== 'function') {
				err = new Error([
					'item at index',
					index,
					'is not a function'].join(' '));

				return true;
			}

			return false;
		});

		if (err) {
			return Promise.reject(err);
		}

		// if there are no items in the list, simply return a Promise
		if (!list.length) {
			return Promise.resolve();
		}

		return new Promise(function (resolve, reject) {
			return list
				.concat([resolve])
				.reduce(
					function (previous, current) {
						return previous
							.then(current)
							.catch(reject);
					},
					Promise.resolve());
		});
	};

	return self;
}({}));
