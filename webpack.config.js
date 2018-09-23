const path = require('path')

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: ['./src/index.ts'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
  },
  devServer: {
    contentBase: '.',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
}
