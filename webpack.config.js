const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = (env, argv) => {
    const entry = argv.mode === 'production' ? './src/index.ts' : ['babel-polyfill', './test/browser/index.ts'];

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
            filename: 'index.js',
            ... (argv.mode === 'development' ? {} : {
                libraryTarget: 'umd',
                library: 'Svg2Png',
                umdNamedDefine: true
            })
        },
        plugins: [
            new CleanWebpackPlugin(),
            new webpack.HotModuleReplacementPlugin()
        ]
    };

    if (argv.mode === 'development') {
        props.plugins.push(
            new HTMLWebpackPlugin({
                title: 'Development',
                template: './test/browser/index.html'
            }))
    }

    return props
};