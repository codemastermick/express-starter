const path = require('path');
const nodeExternals = require('webpack-node-externals');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  entry: {
    index: './src/app.ts',
    auth: './src/auth/auth.routes.config.ts',
    users: './src/users/users.routes.config.ts'
  },
  externalsPresets: { node: true },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          { loader: 'ts-loader', options: { transpileOnly: true } },
        ],
        include: /src/,
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
    path: path.resolve(__dirname, 'dist/'),
    clean: true,
    publicPath: './dist/'
  },
  optimization: {
    usedExports: true
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin()
  ]
};