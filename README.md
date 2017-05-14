# run-script-os

You will be able to use OS specific operations in npm scripts.

## Who would want this?
If you have experienced the pain of trying to make npm scripts usable across different operating system, this package is for you! Looking at you `rm` and `del`!

## Installation
`npm install --save-dev run-script-os`

## Usage

Set `run-script-os` as the value of the npm script that you want different functionality per OS. In the example below, we set `test`.

Then create OS specific scripts. In the example below, you can see:

* `test:win32`
* `test:linux`
* `test:darwin`

Those can have OS specific logic.

`package.json`
```
{
  ...
  "scripts": {
    ...
    "test": "run-script-os",
    "test:win32": "echo 'del whatever you want in Windows 32/64'", 
    "test:linux": "echo 'rm until you cant rm anymore in Linux!'",
    "test:darwin": "echo 'you get the idea (for macOS)'",
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

**Linux Output:**
```
> npm test
rm until you cant rm anymore in Linux!
```

**macOS Output:**
```
> npm test
you get the idea (for macOS)
```

  


There is a more complex example showing pre/post hooks found in the [`package.json` of this repository](https://github.com/charlesguse/run-script-os/blob/master/package.json).

OS Options: `darwin`, `freebsd`, `linux`, `sunos`, `win32`

Note: This list is gotten from [Node's `process.platform`](https://nodejs.org/api/process.html#process_process_platform) and is equivalent to [Node's `os.platform()`](https://nodejs.org/api/os.html#os_os_platform)
