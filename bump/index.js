const diffs = ["major", "minor", "patch"];
const diff = diffs.indexOf(process.argv[2]);

if (diff === -1) {
    console.log("Please provide a diff to increment by: 'major' | 'minor' | 'patch'");
    return;
}

const fs = require("fs");
const getNewVersion = require("./version.js");

const version = getNewVersion(diff);

// update the info
const info = JSON.parse(fs.readFileSync("./src/info.json"));
info.VERSION = version;
fs.writeFileSync("./src/info.json", JSON.stringify(info));

// update the package.json
const pkg = JSON.parse(fs.readFileSync("./package.json"));
pkg.version = version;
fs.writeFileSync("./package.json", JSON.stringify(pkg));

console.log("🎊🎊🎊 Bumped version to " + version + " 🎊🎊🎊");
