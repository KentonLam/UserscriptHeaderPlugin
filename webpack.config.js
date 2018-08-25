
let UHP = require('./UserscriptHeaderPlugin');

module.exports = (env, argv) => {
    let prod = argv.mode === 'production';
    return {
        entry: "./test.js",
        mode: (prod?"production":"development"),
        output: {
            filename: "uq_course_linker" + (prod?".js":".dev.js")
        },
        resolve: {
            // Add '.ts' and '.tsx' as a resolvable extension.
            extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
        },
        module: {
            rules: [
                // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
                { test: /\.tsx?$/, loader: "ts-loader" }
            ]
        },
        plugins: [
            new UHP({'inputFile': './test.js'})
        ]
        }
};