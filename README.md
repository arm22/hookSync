# hooksync

A developer tool to synchronize and install [githooks](https://git-scm.com/book/gr/v2/Customizing-Git-Git-Hooks) between local and remote repositories. Utilizes promises and async/await patterns to symbolically link files in your projects `/hooks` directory to a developers local `.git/hooks`. The sync script will check that the remote hooks are newer than any existing local hooks before linking them.

## Getting Started

### Prerequisites

* [Node v8.9.3](https://nodejs.org/en/download/) (LTS recommended)

### Installing

Install the module as a dev dependency of your projext

```Bash
npm install hooksync -D
```

### Usage

Add hooksync as the "postinstall" script of your `package.json`. This will trigger the sync script to run whenever a developer runs `npm install`.

```Javascript
//Inside your package.json
"scripts": {
    "postinstall": "hooksync",
},
```

Alternatively pass the full PATH of the directory of the folder you want to have parsed and linked to `.git/hooks`

```Javascript
"scripts": {
    "postinstall": "hooksync /path/to/my/hooks",
},
```

hooksync can also be used from the command line, with the same optional PATH argument

```Bash
hooksync

# or with arguments
hooksync /path/to/my/hooks
```

## Built With

* [fs-promise-util](https://www.npmjs.com/package/fs-promise-util) - Promisified file ops in Node (soon to be native)

## Contributing

Feel free to contribute on GitHub

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/arm22/hookSync/tags). 

## Authors

* **Austin Meyers** - *Owner* - [arm22](https://github.com/arm22)

See also the list of [contributors](https://github.com/arm22/hookSync/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

