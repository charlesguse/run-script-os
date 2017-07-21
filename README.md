# run-script-os

You will be able to use OS specific operations in npm scripts.

##Note from surfncode
This is a fork from https://github.com/charlesguse/run-script-os. It fixes the issue "Published index.js file has CRLF line endings, breaks Linux" (https://github.com/charlesguse/run-script-os/issues/1)

## Who would want this?
If you have experienced the pain of trying to make npm scripts usable across different operating system, this package is for you! Looking at you `rm` and `del`!

## Installation
`npm install --save-dev run-script-os-fix`

## Usage

Set `run-script-os` (or `run-os`) as the value of the npm script field that you want different functionality per OS. In the example below, we set `test`, but it can be any npm script. It also uses `pre` and `post` commands (explained more below).

Then create OS specific scripts. In the example below, you can see:

* `test:win32`
* `test:linux:darwin`

Those can have OS specific logic.

`package.json`
```
{
  ...
  "scripts": {
    ...
    "test": "run-script-os",
    "test:win32": "echo 'del whatever you want in Windows 32/64'", 
    "test:darwin:linux": "echo 'You can combine OS tags and rm all the things!'",
    ...
  },
  ...
}
```

**Windows Output:**
```
> npm test
del whatever you want in Windows 32/64
```

**macOS and Linux Output:**
```
> npm test
You can combine OS tags and rm all the things!
```

### NPM Scripts Order
When you call a script like `npm test`, npm will first call `pretest` if it exists. It will then call `test`, which, if you are using `run-script-os`, it will then call `npm run test:YOUR OS`, which in turn will call `pretest:YOUR OS` before actually running `test:YOUR OS`. Then `posttest:YOUR OS` will run, and then after that `posttest` will finally execute.

There is an example showing `pre` and `post` commands found in the [`package.json` of this repository](https://github.com/charlesguse/run-script-os/blob/master/package.json).

OS Options: `darwin`, `freebsd`, `linux`, `sunos`, `win32`

More information can be found in [Node's `process.platform`](https://nodejs.org/api/process.html#process_process_platform) and [Node's `os.platform()`](https://nodejs.org/api/os.html#os_os_platform).
