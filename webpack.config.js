const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
            { test: /\.ts$/, use: 'ts-loader' },
            { 
                test: /\.css$/, 
                use: [ MiniCssExtractPlugin.loader, 'css-loader'] 
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                  'file-loader',
                ],
            },
            { 
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ['file-loader']},
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
          template: 'index.html'
        }),
        new MiniCssExtractPlugin(),
      ]
};
