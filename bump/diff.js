const prompt = require("prompt-sync")({sigint: true});
const diffs = ["major", "minor", "patch"];

module.exports = () => {
    const diff = diffs.indexOf(process.argv[2]);
    if (diff > -1) {
        return diff;
    }

    console.clear();
    const input = prompt("Please provide a diff to increment by 'major' | 'minor' | 'patch': ");
    return diffs.indexOf(input);
};
