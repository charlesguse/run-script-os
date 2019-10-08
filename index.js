#! /usr/bin/env node
"use strict";
const path = require("path");

/**
 * Functions defined to separate the alias and regex matching
 */
const matchScript = require ('./functions.js').matchScript;
const expandShorthand = require('./functions.js').expandShorthand;

/**
 * This package can only be executed from within the npm script execution context
 */
if (!process.env["npm_config_argv"]) {
  console.log("This is meant to be run from within npm script. See https://github.com/charlesguse/run-script-os");
  return;
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
let npmArgs = JSON.parse(process.env["npm_config_argv"]);
let options = npmArgs.original;

if (!(options[0] === "run" || options[0] === "run-script")) {
  options.unshift("run");
}

/**
 * Expand shorthand command descriptors
 */
options[1] = expandShorthand(options[1]);

// Check for yarn without install command; fixes #13
if (process.env.npm_config_user_agent.includes('yarn') && !options[1]) options[1] = 'install';

let osCommand = `${options[1]}:${platform}`;
let foundMatch = true;

let argument = options[1];
let event = process.env["npm_lifecycle_event"];

/**
 * Yarn support
 * Check for yarn without install command; fixes #13
 */
if (process.env.npm_config_user_agent.includes('yarn') && !argument) {
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
  process.exit(0);
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

/**
 * Check if we should be passing the original arguments to the new script
 * Fix for #23
 */
const args = process.argv.slice(2).map((a) => a.toLowerCase());
if (args.includes('--no-arguments')) {
  options = options.slice(0,2);
}

/**
 * Spawn new process to run the required script
 *
 * Open either the cmd file or the cmd command, if we're in windows
 */
let platformSpecific;
if (platform === "win32") {
  platformSpecific = spawn("npm.cmd", options, { shell: true, stdio: "inherit"});
} else {
  platformSpecific = spawn("npm", options, { shell: true, stdio: "inherit" });
}

/**
 * Finish the execution
 */
platformSpecific.on("exit", (code) => {
  process.exit(code);
});
