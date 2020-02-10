module.exports = {
    entry: './index.ts',
    mode: 'development',
    output: {
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },

    module: {
        rules: [
            { test: /\.ts$/, use: 'ts-loader' }
        ]
    }
};
