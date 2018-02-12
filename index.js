#! /usr/bin/env node

const fs = require('fs-promise-util').default;

const REMOTE_HOOKS_PATH = `${process.cwd()}/hooks/`;
const LOCAL_HOOKS_PATH = `${process.cwd()}/.git/hooks/`;

main(process.argv[2]).then(() => {
	console.log('hooksync complete')
}).catch((err) => {
	console.log(err);
});

async function main (arg) {
	const CLI_PATH = arg;
	let remoteList,
		localList,
		copyList,
		conflictingFiles;

	// Await process of listing files in remote (or dir passed as option) and local dirs
	[remoteList, localList] = await getDirList(CLI_PATH || REMOTE_HOOKS_PATH, LOCAL_HOOKS_PATH);

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
	console.log(`discovered ${copyList.length} hook(s)`);
	mapAndPromisify(copyList, (value) => {
		let newPath = value.replace('hooks', '.git/hooks');
		console.log(`linking: ${value} -> ${newPath}`);
		return fs.symlink(value, newPath);
	});
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
		return !arr.includes(value);
	};
}