const fs = require("fs");

module.exports = (diff) => {
    const file = fs.readFileSync("./package.json", "utf8");
    const info = JSON.parse(file);

    const old = info.version.split(".").map((n) => parseInt(n));

    const output = [];
    for (let i = 0; i < 3; i++) {
        if (i < diff) {
            output.push(old[i]);
        } else if (i === diff) {
            output.push(old[i] + 1);
        } else {
            output.push(0);
        }
    }

    return output.join(".");
};
