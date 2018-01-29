'use strict';

const fs = require('fs-promise-util').default;

const REMOTE_HOOKS_PATH = `${process.cwd()}/hooks/`;
const LOCAL_HOOKS_PATH = `${process.cwd()}/.git/hooks/`;


exports.install = async function () {
	let remoteList,
		localList,
		copyList,
		conflictingFiles;

	// Await process of listing files in remote and local dirs
	[remoteList, localList] = await getDirList(REMOTE_HOOKS_PATH, LOCAL_HOOKS_PATH);

	// Find files that exist both locally and remotely
	conflictingFiles = localList.filter(isInArray(remoteList));

	// Remove files conflicting files to be processed seperately
	copyList = remoteList.filter(notInArray(conflictingFiles));

	// Add the full path to the files to be copied
	copyList = copyList.map((fileName) => {
		return `${REMOTE_HOOKS_PATH}${fileName}`;
	});

	// Await getting the path of the most recent of the conflicting files
	conflictingFiles = await mapAndPromisify(conflictingFiles, getLatestPath);

	// Add conflicting files to be copied and remove empty values
	copyList = copyList.concat(conflictingFiles);
	copyList = copyList.filter(Boolean);

	// Write files to local hooks dir
	console.log(`writing ${copyList.length} files`);
	mapAndPromisify(copyList, (value) => {
		let newPath = value.replace('hooks', '.git/hooks');
		console.log(`symLinking ${value} to ${newPath}`);
		return fs.symlink(value, newPath);
	});

	return 'complete';
}

function mapAndPromisify (arr, resolveFunc) {
		let promises = arr.map((value) => {
		return new Promise((resolve, reject) => {
			try {
				resolve(resolveFunc(value));
			} catch(err) {
				reject(err);
			}
		});
	});
	return Promise.all(
		promises
	).then(
		([results]) => (results)
	);
}

function getDirList (remotePath, localPath) {
	return Promise.all([
		fs.readdir(remotePath),
		fs.readdir(localPath)
	]).then(
		([remoteList, localList]) => ([remoteList, localList])
	);
}

function getLatestPath (fileName) {
	return Promise.all([
		fs.stat(`${REMOTE_HOOKS_PATH}${fileName}`),
		fs.stat(`${LOCAL_HOOKS_PATH}${fileName}`)
	]).then(([remoteFileStats, localFileStats]) => {
		const remoteTime = new Date(remoteFileStats.mtime);
		const localTime = new Date(localFileStats.mtime);

		return (remoteTime > localTime ? `${REMOTE_HOOKS_PATH}${fileName}` : '');
		});
}

function isInArray (arr) {
	return function (value) {
		return arr.includes(value);
	};
}

function notInArray (arr) {
	return function (value) {
		return (!arr.includes(value) && value !== 'hookSync.js');
	};
}