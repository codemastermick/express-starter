const path = require('path');
const nodeExternals = require('webpack-node-externals');

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
          { loader: 'ts-loader', options: { transpileOnly: true } }
        ],
        include: path.resolve(__dirname, 'src'),
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
  }
};