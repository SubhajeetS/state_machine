const path = require('path');

module.exports = {
    entry: './index.ts',
    mode: 'development',
    output: {
        filename: 'bundle3.js'
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
    }
};
