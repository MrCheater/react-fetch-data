var webpack = require('webpack');

module.exports = {
    entry:  "./example/src/client.js",
    output: {
        path: "./example/dist/",
        filename: "client.js",
        publicPath: '/client.js',
        devtoolModuleFilenameTemplate: "[resource-path]",
        devtoolFallbackModuleFilenameTemplate: "[resource-path]?[hash]"
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: __dirname + "/node_modules/",
                loader: "babel-loader"
            }
        ]
    },
    resolve: {
        extensions: ['','.js']
    }
};
