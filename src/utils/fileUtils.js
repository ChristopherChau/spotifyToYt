const fs = require("fs");

async function createDirectory(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
}

module.exports = { createDirectory };
