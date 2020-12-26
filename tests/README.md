# run-script-os tests

GitHub Actions makes it trivial to test this project across the different operating systems and due to the nature of the package, it would be good to test this on the three primary OSs (Windows, Linux, Mac).

---

## Test Code Structure
Tests are split up into two categories, Bash tests and PowerShell tests. The tests should be as identical as is realistic within their languages and coding styles. `windows.test.ps1` and `nix.test.bats` are about as identical as they can be while using their respective scripting languages.

The Bash tests exist in `nix.test.bats` and that test file is called by `linux.test.sh` and `macos.test.sh`. The scripts set an environment variable (`NIX_OS`) to grab the proper test results (`linux/mac.expected.txt`). The environment variable `NIX_OS` DOES NOT override anything within npm-run-script itself and is only used within `nix.test.bats` for testing purposes.

The PowerShell tests don't return a status code of the errors by default. This chain of PowerShell commands `Invoke-Pester -Configuration (Get-Content ./windows.configuration.json | ConvertFrom-Json) | Select-Object -ExpandProperty FailedCount | Should -BeNull"` will return a non-zero status code if there are failed tests.

Broken down, `Invoke-Pester -Configuration (Get-Content ./windows.configuration.json | ConvertFrom-Json)`, Pester is pulling in a configuration file (`./windows.configuration.json`) to use to run the tests. `Invoke-Pester` returns a complex object that then needs to be queried for how many tests failed.

That is handled in this next section. `| Select-Object -ExpandProperty FailedCount | Should -BeNull"` queries the object returned from Pester for the FailedCount of the tests and then the `Should` command will return a non-zero status code if `FailedCount` is anything but null.

Within the NPM scripts section, all of that is wrapped in `@powershell -NoProfile -Command \"Invoke-Pester ... | Should -BeNull\""`. This is so that NPM will run the command in PowerShell regardless of which shell it was actually invoked in (often times CMD on Windows).

---

## Testing Tech/framework Used
While this is an NPM package, the expected use-case is to embed this command into NPM scripts to run the proper shell commands for any operating system. For that reason, the testing frameworks are focused around bash and powershell.

### Bash Automated Testing System (Bats)
Bats is a testing framework for Bash. `nix.test.bats` runs within Bats and calls Bash internally. NPM is being used to install Bats for testing only. To run these tests, cd into `run-script-os/tests` and run `npm install`. To make the bats script easy to properly interpret, you can see the shebang in the `.bats` files and that it references the local `node_modules` folder.

### Pester
Pester is the built-in testing framework for Windows. Version 5+ is expected. Your Windows machine may come with an older version of Pester that expects different syntax. [This guide](https://pester-docs.netlify.app/docs/introduction/installation) will show you how to update to the newest version of Pester.

---

## Features
* Tests across Windows, Linux, and Mac
* Tests across multiple versions of NPM

### Wishlist (not implemented currently)
* Code coverage of the NPM package during tests

---

## Installation
1. `npm install`
1. `npm test`

## Testing Framework References
1. Bats
    * Docs https://bats-core.readthedocs.io/en/latest/
    * GitHub https://github.com/bats-core/bats-core
1. Pester Reference
    * Docs https://pester-docs.netlify.app/
    * GitHub https://github.com/pester/pester
