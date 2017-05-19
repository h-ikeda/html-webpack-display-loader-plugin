module.exports = () => {
    return {
        entry: __dirname + "/test_index.js",
        output: {
            filename: "test_bundle.js",
            path: __dirname + "/temp"
        },
        plugins: [
            new (require("html-webpack-plugin"))({
                filename: "test_index.html"
            })
        ]
    };
};
