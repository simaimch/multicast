// webpack.config.js
const path = require('path');

module.exports = {
    target: 'node',
    entry: './bin/server/src/server.js',
    output: {
        filename: 'server.js',
        path: path.resolve(__dirname, 'dist'),
    },
    // Additional configuration goes here
};