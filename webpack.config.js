const path = require('path');

module.exports = {
    mode: "production",
    entry: "./src/5x5jqpi.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "5x5jqpi.min.js"
    },
    node: {
        // fs: "empty" //https://github.com/pugjs/pug-loader/issues/8
    },
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    },
    externals: {
        jquery: 'jQuery',
        bootstrap: 'bootstrap'
    }
};
