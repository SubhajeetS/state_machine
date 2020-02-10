const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './index.ts',
    mode: 'development',
    output: {
        filename: '[bundle].[contenthash].js',
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    devServer: { //todo: remove. it's for dev server only
        contentBase: path.resolve(__dirname, '.')
    },
    module: {
        rules: [
            { test: /\.ts$/, use: 'ts-loader' }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
          template: 'index.html'
        })
      ]
};
