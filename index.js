#! /usr/bin/env node
"use strict";

if (!process.env["npm_config_argv"]) {
    console.log("This is meant to be run from within npm script. See https://github.com/charlesguse/run-script-os");
    return;
}
const spawn = require("child_process").spawn;
const scripts = require('./package.json').scripts;

let npmArgs = JSON.parse(process.env["npm_config_argv"]);
let options = npmArgs.original;
if (!(options[0] === "run" || options[0] === "run-script")) {
    options.unshift("run");
}
let osCommand = `${options[1]}:${process.platform}`
if (!scripts.hasOwnProperty(osCommand)) {
    let regex = new RegExp(`^(${options[1]}):([a-zA-Z0-9-]*:)*(${process.platform})(:[a-zA-Z0-9-]*)*$`, "g")
    for (let command in scripts) {
        if (command.match(regex)) {
            osCommand = command;
            break;
        }
    }
}
options[1] = osCommand;

let platformSpecific;
if (process.platform === "win32") {
    platformSpecific = spawn("npm.cmd", options);
} else {
    platformSpecific = spawn("npm", options);
}
platformSpecific.stdout.on('data', data => console.log(`${data}`));
platformSpecific.stderr.on('data', data => console.log(`${data}`));
