const diff = require("./diff.js")();

if (diff === -1) {
    console.log("Invalid diff value");
    return;
}

const fs = require("fs");
const version = require("./version.js")(diff);

// update the info
const info = JSON.parse(fs.readFileSync("./src/info.json"));
info.VERSION = version;
fs.writeFileSync("./src/info.json", JSON.stringify(info, undefined, 4));

// update the package.json
const pkg = JSON.parse(fs.readFileSync("./package.json"));
pkg.version = version;
fs.writeFileSync("./package.json", JSON.stringify(pkg, undefined, 4));

console.log("🎊🎊🎊 Bumped version to " + version + " 🎊🎊🎊");
