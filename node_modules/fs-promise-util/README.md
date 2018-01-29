# fs-promise-util

[![Build Status](https://travis-ci.org/PlayNetwork/fs-promise-util.svg?branch=master)](https://travis-ci.org/PlayNetwork/fs-promise-util)
[![Coverage Status](https://coveralls.io/repos/github/PlayNetwork/fs-promise-util/badge.svg?branch=master)](https://coveralls.io/github/PlayNetwork/fs-promise-util?branch=master)

A utility library for file system interaction. All methods return a promise.

##### new async methods

- [ensurePath](https://github.com/PlayNetwork/fs-promise-util/tree/v1.0.0#fs-promise-utilensurepath-directorypath)
- [prune](https://github.com/PlayNetwork/fs-promise-util/tree/v1.0.0#fs-promise-utilprune-directorypath-filter-retaincount)
- [readAndSort](https://github.com/PlayNetwork/fs-promise-util/tree/v1.0.0#fs-promise-utilreadandsort-directorypath-options)

##### fs async methods

- [appendFile](https://github.com/PlayNetwork/fs-promise-util/tree/v1.0.0#fs-promise-utilappendfile-file-data-options)
- [createReadStream](https://github.com/PlayNetwork/fs-promise-util/tree/v1.0.0#fs-promise-utilcreatereadstream-filepath-options)
- [createWriteStream](https://github.com/PlayNetwork/fs-promise-util/tree/v1.0.0#fs-promise-utilcreatewritestream-filepath-options)
- [exists](https://github.com/PlayNetwork/fs-promise-util/tree/v1.0.0#fs-promise-utilexists-filepath)
- [lstat](https://github.com/PlayNetwork/fs-promise-util/tree/v1.0.0#fs-promise-utillstat-path)
- [readdir](https://github.com/PlayNetwork/fs-promise-util/tree/v1.0.0#fs-promise-utilreaddir-path-options)
- [readlink](https://github.com/PlayNetwork/fs-promise-util/tree/v1.0.0#fs-promise-utilreadlink-path-options)
- [readFile](https://github.com/PlayNetwork/fs-promise-util/tree/v1.0.0#fs-promise-utilreadfile-file-options)
- [realpath](https://github.com/PlayNetwork/fs-promise-util/tree/v1.0.0#fs-promise-utilrealpath-path-options)
- [rename](https://github.com/PlayNetwork/fs-promise-util/tree/v1.0.0#fs-promise-utilrename-oldpath-newpath)
- [stat](https://github.com/PlayNetwork/fs-promise-util/tree/v1.0.0#fs-promise-utilstat-path)
- [symlink](https://github.com/PlayNetwork/fs-promise-util/tree/v1.0.0#fs-promise-utilsymlink-target-path)
- [unlink](https://github.com/PlayNetwork/fs-promise-util/tree/v1.0.0#fs-promise-utilunlink-path)
- [writeFile](https://github.com/PlayNetwork/fs-promise-util/tree/v1.0.0#fs-promise-utilwritefile-filepath-data-options)



This library utilizes the graceful-fs, an improvement over the fs module.


## Requirements

* `Node.js`: >= `v4.x`
* `Platform`: `Darwin`, `Unix` or `Linux` (_Windows is not supported at this time_)

## Installation

```bash
npm install fs-promise-util
```

## Usage

This module exposes the following methods:

### fs-promise-util.appendFile (file, data, options)

fs-promise-util.appendFile appends data to a file, creating the file if it does not exist. It returns a promise for [fs.appendFile](https://nodejs.org/dist/latest-v7.x/docs/api/fs.html#fs_fs_appendfile_file_data_options_callback).

* `file` - [ string | Buffer | number ] - filename or file descriptor
* `data` - [ string | Buffer ]
* `options` - [ Object | string ]

	* `encoding` - [ string | null ] - default = `utf8`
	* `mode` - [ integer ] - default = 0o666
	* `flag` - [ string ] - default = `a`

```javascript
import fs from 'fs-promise-util';

export async function saveMessage (message = '') {
  return await fs
    .appendFile(
      '/path/to/messages.log',
      message,
      {
        encoding : 'utf8'
      }
    ).catch((err) => {
      console.error(err);
    });
}
```

### fs-promise-util.createReadStream (filepath, options)


fs-promise-util.createReadStream allows you to open up a readable stream. All you have to do is pass the path of the file to start streaming in.

* `path` - [ string | Buffer ]
* `options` - [ string | Object ]
	* `flags` - [ string ]
	* `encoding` - [ string ]
	* `fd` - [ integer ]
	* `mode` - [ integer ]
	* `autoClose` - [ boolean ]
	* `start` - [ integer ]
	* `end` - [ integer]

```javascript
import fs from 'fs-promise-util';

export async function getContent () {
  return await new Promise((resolve, reject) => {
    let
      chunks = [],
      reader = fs
        .createReadStream(
          '/path/to/messages.log',
          {
            encoding : 'utf8'
          }
        );

    // capture events
    reader.on('data', (chunk) => chunks.push(chunk));
    reader.on('end', () => resolve(chunks.join('')));
    reader.on('error', reject);
  });
}
```

`options` is an object or string with the following defaults:

```javascript
{
  flags: 'r',
  encoding: null,
  fd: null,
  mode: 0o666,
  autoClose: true
}
```

### fs-promise-util.createWriteStream (filepath, options)

fs-promise-util.createWriteStream creates a writable stream. After a call to fs-promise-util.createWriteStream with the filepath, you have a writeable stream to work with.

* `path` - [ string | Buffer ]
* `options` - [ string | Object ]
	* `flags` - [ string ]
	* `defaultEncoding` - [ string ]
	* `fd` - [ integer ]
	* `mode` - [ integer ]
	* `autoClose` - [ boolean ]
	* `start` - [ integer ]

`options` is an object or string with the following defaults:

```javascript
{
  flags: 'w',
  defaultEncoding: 'utf8',
  fd: null,
  mode: 0o666,
  autoClose: true
}
```

```javascript
import fs from 'fs-promise-util';

export async function writeContent () {
  return await new Promise((resolve, reject) => {
    let writer = fs
      .createWriteStream(
        '/path/to/messages.log',
        {
          encoding : 'utf8'
        }
      );

    // capture events
    writer.on('error', reject);
    writer.on('finish', resolve);
    // write data
    writer.end(data);
  });
}
```

### fs-promise-util.ensurePath (directoryPath)

fs-promise-util.ensurePath creates a given path and returns a promise. It takes in a string  value which is the directory path.

* `directoryPath` - [ string ]

```javascript
import fs from 'fs-promise-util';

export async function writeContent () {
  return await fs
    .ensurePath(
      '/path/to/messages'
    ).then((path) => {
      console.info('directory created');
      return Promise.resolve(path);
    }).catch((err) => {
      console.error(err);
    });
}
```

### fs-promise-util.exists (filePath)

fs-promise-util.exists takes in a path as an argument. It checks whether a given path exists in the file system and resolves to a true or a false.

```javascript
import fs from 'fs-promise-util';

export async function checkIfExists () {
  let exists = await fs
    .exists(
      '/path/to/messages.log'
    );

  return exists;
}
```

### fs-promise-util.lstat (path)

fs-promise-util.lstat returns a promise for [lstat](https://nodejs.org/api/fs.html#fs_fs_lstat_path_callback).

```javascript
import fs from 'fs-promise-util';

export async function getStatus () {
  return fs
    .lstat(
      '/path/to/messages.log'
    ).catch((err) => {
      console.error(err);
    });
}
```

### fs-promise-util.prune (directoryPath, filter, retainCount)

fs-promise-util.prune removes 'x' number of least recent files matching a given pattern from a directory.

* `directoryPath` - [ string ] - directory to remove the files
* `filter` - [ string ] - pattern for the file removal, i.e. a regular expression matching a file name
* `retainCount` - [ number ] - number of files you want to keep in the directory

```javascript
import fs from 'fs-promise-util';

export async function removeFiles () {
  return await fs
    .prune(
      '/path/to/messages',
      new RegExp('\\w+'),
      'number of files to keep'
    ).catch((err) => {
      console.error(err);
    });
}
```

### fs-promise-util.readdir (path, options)

fs-promise-util.readdir reads the contents of a directory and returns a promise.

* `path` - [ string | Buffer ]
* `options` - [ string | Object ]
	* `encoding` - [ string ] - default = `utf8`

```javascript
import fs from 'fs-promise-util';

export async function getFiles () {
  return await fs
    .readdir(
      '/path/to/messages directory',
      {
        encoding : 'utf8'
      }
    ).catch((err) => {
      console.error(err);
    });
}
```

### fs-promise-util.readlink (path, options)

fs-promise-util.readlink returns the absolute path of a file or folder pointed by a symlink as a promise. If the path is not a symlink or shortcut, it will resolve to an empty string.

* `path` - [ string | Buffer ]
* `options` - [ string | Object ]
	* `encoding` - [ string ] - default = `utf8`

```javascript
import fs from 'fs-promise-util';

export async function getPath () {
  return await fs
    .readlink(
      '/path/to/messages.log',
      'utf8'
    ).catch((err) => {
      console.error(err);
    });
}
```

### fs-promise-util.readAndSort (directoryPath, options)

fs-promise-util.readAndSort reads the content of the directory passed and sorts files based on date and returns files. 'options' object can be used to pass in:

* `options.sort` - [ string ] - sort files based on date
* `options.filter` - [ string ] - any filters passed with the file name (`options.filter.name`)

```javascript
import fs from 'fs-promise-util';

export async function sortFiles () {
  let exists = await fs
    .readAndSort(
      '/path/to/messages directory',
      {
        filter : {
          name : new RegExp('\\w+')
        }
      }
    ).catch((err) => {
      console.error(err);
    });
}
```

### fs-promise-util.readFile (file, options)

fs-promise-util.readFile reads the entire contents of a file asynchronously and returns a promise.

* `file` - [string | Buffer | integer ] - filename or file descriptor
* `options` - [ Object | string ]
	* `encoding` - [ string | null ] - default = null
	* `flag` - [ string ] - default = `r`

```javascript
import fs from 'fs-promise-util';

export async function getFileContent () {
  return await fs
    .readFile(
      '/path/to/log.txt'
    ).catch((err) => {
      console.error(err);
    });
}
```

If `options` is a string, then it specifies the encoding.

```javascript
import fs from 'fs-promise-util';

export async function getFileContent () {
  return await fs
    .readFile(
      '/path/to/messages directory',
      'utf8'
    ).catch((err) => {
      console.error(err);
    });
}
```

### fs-promise-util.realpath (path, options)

fs-promise-util.realpath returns the absolute pathname for the given path as a promise. In other words, it returns a promise for [fs.realPath](https://nodejs.org/dist/latest-v7.x/docs/api/fs.html#fs_fs_realpath_path_options_callback).

The `options` argument can be a string specifying an encoding or an object with an encoding property specifying the character encoding to use for the path passed to the callback. If the encoding is set to buffer, the path returned will be passed as a Buffer object.

* `path` - [ string | Buffer ]
* `options` - [ string | Object ]
	* `encoding` - [ string ] - default = `utf8`

Lets say the directory structure is `/etc/readme`:

```javascript
import fs from 'fs-promise-util';

export async function getAbsolutePath () {
  return await fs
    .realPath(
      '/messages directory',
      'utf8'
    ).catch((err) => {
      console.error(err);
    });
}
```

### fs-promise-util.rename (oldPath, newPath)

fs-promise-util.rename renames a file, moving it between directories if required, and returns a promise for `fs.rename`.

* `oldPath` - [ string | Buffer ]
* `newPath` - [ string | Buffer ]

```javascript
import fs from 'fs-promise-util';

export async function renameFile () {
  return await fs
    .rename(
      '/path/to/tmp dir',
      '/path/to/messages dir'
    ).catch((err) => {
      console.error(err);
    });
}
```

* If `newPath` already exists, it will be automatically replaced so that there is no point in which another process attempting to access `newPath` will find it missing.  However, there will probably be a window in which both `oldPath` and `newPath` refer to the file being renamed.
* If `oldPath` and `newPath` are existing hard links referring to the same file, then `rename()` does nothing and returns a success status.
* If `newPath` exists but the operation fails for some reason, `rename()` guarantees to leave an instance of `newPath` in place.
* `oldPath` can specify a directory.  In this case, `newPath` must either not exist, or it must specify an empty directory.
* If `oldPath` refers to a symbolic link, the link is renamed; if `newPath` refers to a symbolic link, the link will be overwritten.

### fs-promise-util.stat (path)

This method retrieves information about a file pointed to by the given path and returns a promise for [fs.stat](http://nodejs.cn/doc/node/fs.html#fs_fs_stat_path_callback).

* `path` - [ string | Buffer ]

```javascript
import fs from 'fs-promise-util';

export async function getStat () {
  return fs
    .stat(
      '/path/to/info.log'
    ).catch((err) => {
      console.error(err);
    });
}
```

### fs-promise-util.symlink (target, path)

fs-promise-util.symlink creates a symbolic link named `path` which contains the string target and returns a promise for [fs.symlink](http://nodejs.cn/doc/node/fs.html#fs_fs_symlink_target_path_type_callback).

* `target` - [ string | Buffer ]
* `path` - [ string | Buffer ]

```javascript
import fs from 'fs-promise-util';

export async function createSymink () {
  return await fs
    .symlink(
      './foo',
      './bar'
    ).catch((err) => {
      console.error(err);
    });
}
```
The above function creates a symbolic link named `bar` that points to `foo`.

* Symbolic links are interpreted at run time as if the contents of the link had been substituted into the path being followed to find a file or directory.
* Symbolic links may contain path components, which, if used at the start of the link, refer to the parent directories of that in which the link resides.
* A symbolic link, also known as a soft link, may point to an existing file or to a nonexistent one; the latter case is known as a dangling link.
* If `path` exists, it will not be overwritten.

### fs-promise-util.tryWriteFile (file, data, options)

fs-promise-util.tryWriteFile is a wrapper for `fs-promise-util.writeFile` that always resolves to a promise.  It asynchronously writes data to a file, replacing the file if it already exists.

The encoding option is ignored if `data` is a buffer and defaults to `utf8`.

* `file` - [ string | Buffer | number ] - filename or file descriptor
* `data` - [ string | Buffer ]
* `options` - [ Object | string ]
	* `encoding` - [ string | null ] - default = `utf8`
	* `mode` - [ integer ] - default = 0o666
	* `flag` - [ string ] - default = `w`

```javascript
import fs from 'fs-promise-util';

export async function tryWriteContent (data = '') {
  return await fs
    .tryWriteFile(
      '/path/to/info.log',
      'data',
      {
        encoding : 'utf8'
      }
    ).catch((err) => {
      console.error(err);
    });
}
```

### fs-promise-util.unlink (path)

fs-promise-util.unlink deletes a name from the filesystem and returns a promise for `fs.unlink`.

* `path` - [ string | Buffer ]

```javascript
import fs from 'fs-promise-util';

export async function delete () {
  return fs
    .unlink(
      '/path/to/file'
    ).catch((err) => {
      console.error(err);
    });
}
```

* If that name was the last link to a file and no processes have the file open, the file is deleted and the space it was using is made available for reuse.
* If the name was the last link to a file but any processes still have the file open, the file will remain in existence until the last file descriptor referring to it is closed.
* If the name referred to a symbolic link, the link is removed.

### fs-promise-util.writeFile (filePath, data, options)

fs-promise-util.writeFile asynchronously writes data to a file, replacing the file if it already exists, and returns a promise for [fs.writeFile](http://nodejs.cn/doc/node/fs.html#fs_fs_writefile_file_data_options_callback).

The encoding option is ignored if `data` is a buffer. It defaults to `utf8`.
If `options` is a string, then it specifies the encoding.

* `file` - [ string | Buffer | number ] - filename or file descriptor
* `data` - [ string | Buffer | Uint8Array ]
* `options` - [ Object | string ]
	* `encoding` - [ string | null ] - default = `utf8`
	* `mode` - [ integer ] - default = 0o666
	* `flag` [ string ] - default = `w`

```javascript
import fs from 'fs-promise-util';

export async function tryWriteContent () {
  return await fs
    .writeFile(
      '/path/to/messages.log',
      'data to write',
      {
        encoding : 'utf8'
      }
    ).catch((err) => {
      console.error(err);
    });
}
```