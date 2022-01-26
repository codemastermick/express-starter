require("dotenv");
const { merge } = require('webpack-merge');

const envConfig = process.env.NODE_ENV === 'production' ? require('./webpack.prod') : require('./webpack.dev');

// We use this here at edX
module.exports = merge(require('./webpack.common'), envConfig);