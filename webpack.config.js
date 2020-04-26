const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = (env) => {

    const entry = env === 'test' ? ['babel-polyfill','./test/browser/index.ts'] : './src/index.ts';

    const props = {
        entry: entry,
        module: {
            rules: [
                {
                    test: /\.ts/,
                    use: 'awesome-typescript-loader',
                    exclude: /node-modules/
                }
            ]
        },
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            compress: true,
            port: 4200
        },
        resolve: {
            extensions: ['.ts', '.js']
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'index.js'
        },
        plugins: [
            new CleanWebpackPlugin(),
            new webpack.HotModuleReplacementPlugin()
        ]
    };

    if (env === 'test') {
        props.plugins.push(
            new HTMLWebpackPlugin({
                title: 'Development',
                template: './test/browser/index.html'
            }))
    }

    return props
};