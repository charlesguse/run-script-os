#! /usr/bin/env node
"use strict";
const path = require("path");

/**
 * Functions defined to separate the alias and regex matching
 */
const matchScript = require ('./functions.js').matchScript;
const expandShorthand = require('./functions.js').expandShorthand;

const INCORRECT_USAGE_CODE = 255
const MISSING_COMMAND_CODE = 254


/**
 * This package can only be executed from within the npm script execution context
 */
if (!process.env["npm_config_argv"] && !process.env["npm_lifecycle_event"]) {
  console.log("This is meant to be run from within npm script. See https://github.com/charlesguse/run-script-os");
  process.exit(INCORRECT_USAGE_CODE);
}

/**
 * Executor process to match the script without blocking
 */
const spawn = require("child_process").spawn;

/**
 * Switch to linux platform if cygwin/gitbash detected (fixes #7)
 * Allow overriding this behavior (fixes #11)
 */
let platform = process.platform;
if (process.env.RUN_OS_WINBASH_IS_LINUX) {
  let shell = process.env.SHELL || process.env.TERM;
  shell = shell && shell.match("bash.exe") ? "bash.exe" : shell;
  platform = shell && ["bash.exe", "cygwin"].includes(shell) ? "linux" : process.platform;
}

/**
 * Scripts as found on the user's package.json
 */
const scripts = require(path.join(process.cwd(), "package.json")).scripts;

/**
 * The script being executed can come from either lifecycle events or command arguments
 */
let options
if (process.env["npm_config_argv"]) {
    let npmArgs = JSON.parse(process.env["npm_config_argv"]);
    options = npmArgs.original;
} else {
    options =
        [process.env["npm_command"], process.env["npm_lifecycle_event"]];
}
if (!(options[0] === "run" || options[0] === "run-script")) {
    options.unshift("run");
}

/**
 * Expand shorthand command descriptors
 */
options[1] = expandShorthand(options[1]);

// Check for yarn without install command; fixes #13
const isYarn = (process.env.npm_config_user_agent && process.env.npm_config_user_agent.includes('yarn')) ? true : false;
if (isYarn && !options[1]) options[1] = 'install';

let osCommand = `${options[1]}:${platform}`;
let foundMatch = true;

let argument = options[1];
let event = process.env["npm_lifecycle_event"];

/**
 * Yarn support
 * Check for yarn without install command; fixes #13
 */
if (isYarn && !argument) {
  argument = 'install';
}

/**
   * More in-depth match
   * Execute the regular expression to help identify missing scripts
   * It also tests for different aliases
 */
osCommand = matchScript(event || argument, platform, scripts);

/**
 * Test again, this time to end the process gracefully
 */
if (!osCommand) {
  console.log(`run-script-os was unable to execute the script '${event || argument}'`);
  process.exit(MISSING_COMMAND_CODE);
}

/**
 * If it hasn't already, we set the command to be executed via npm run or npm run-script
 */
if (!(options[0] === "run" || options[0] === "run-script")) {
  options.unshift("run");
}

/**
 * Lastly, set the script to be executed
 */
options[1] = osCommand;


const supportedArgs = ['--no-arguments'];
let args = process.argv.slice(2).map((a) => a.toLowerCase());;
let argsCount = 0;
for (let i = 0; i < args.length; i += 1) {
  if (supportedArgs.includes(args[i])) {
    argsCount = i;
  }
}
args = args.slice(0, argsCount);

/**
 * Append arguments passed to the run-script-os
 * Check if we should be passing the original arguments to the new script
 * Fix for #23
 */
options = options.slice(0,2);
if (!args.includes('--no-arguments')) {
  options = options.concat(process.argv.slice(2 + argsCount));
}

/**
 * Spawn new process to run the required script
 *
 * Open either the cmd file or the cmd command, if we're in windows
 */
let packageManagerCommand;

packageManagerCommand = isYarn ? "yarn" : "npm";
if (platform === "win32") {
  packageManagerCommand = packageManagerCommand + ".cmd";
}

const childProcess = spawn(packageManagerCommand, options, { shell: true, stdio: "inherit"});

/**
 * Finish the execution
 */
childProcess.on("exit", (code) => {
  process.exit(code);
});
