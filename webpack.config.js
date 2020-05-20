const path = require('path');

module.exports = {
    mode: "development",
    entry: "./src/5x5jqpi.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "5x5jqpi.min.js"
    },
    node: {
        fs: "empty" //https://github.com/pugjs/pug-loader/issues/8
    }
};
