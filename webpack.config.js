const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: ['./src/index.ts'],
  output: {
    filename:
      process.env.NODE_ENV !== 'production' ? 'bundle.js' : 'bundle-[hash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
  },
  devServer: {
    contentBase: '.',
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      dry: process.env.NODE_ENV !== 'production',
      exclude: ['.keep'],
    }),
    new CopyWebpackPlugin([{ from: 'assets', to: 'assets' }]),
    new HtmlWebpackPlugin({
      template: './index.html',
      minify: { minifyCSS: true },
    }),
  ],
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
};
