const path = require('path');
const nodeExternals = require('webpack-node-externals');
const {
  NODE_ENV = 'production',
} = process.env;

module.exports = {
  entry: {
    index: './src/app.ts',
    auth: './src/auth/auth.routes.config.ts',
    users: './src/users/users.routes.config.ts'
  },
  mode: NODE_ENV,
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  externalsPresets: { node: true },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  target: 'node',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  optimization: {
    usedExports: true
  },
  watch: NODE_ENV === 'development'
};