#! /usr/bin/env node
"use strict";
const spawn = require("child_process").spawn;

if (!process.env["npm_config_argv"]) {
    console.log("This is meant to be run from within npm script. See ");
    return;
}
let npmArgs = JSON.parse(process.env["npm_config_argv"]);
let options = npmArgs.original;

if (!(options[0] === "run" || options[0] === "run-script")) {
    options.unshift("run");
}
options[1] = `${options[1]}:${process.platform}`;

let platformSpecific;

if (process.platform === "win32") {
    platformSpecific = spawn("npm.cmd", options);
} else {
    platformSpecific = spawn("npm", options);
}
platformSpecific.stdout.on('data', data => console.log(`${data}`));
platformSpecific.stderr.on('data', data => console.log(`${data}`));
