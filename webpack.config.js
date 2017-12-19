const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const BUILD_DIR = path.resolve(__dirname, 'out');
const APP_DIR = path.resolve(__dirname, 'src');

const config = {
  entry: {
    main: `${APP_DIR}/index.jsx`,
    vendor: ['react', 'react-dom', 'react-router', 'react-share'],
  },
  output: {
    path: BUILD_DIR,
    publicPath: '/',
    filename: '[chunkhash].[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js?/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.jsx?/,
        include: APP_DIR,
        use: 'babel-loader',
      },
      {
        test: /\.json$/,
        use: 'json-loader',
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader?sourceMap',
        }),
      },
    ],
  },
  devtool: 'source-map',
  performance: { hints: false },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
      minChunks: Infinity,
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      chunks: ['main', 'vendor', 'manifest'],
      template: 'index.ejs',
    }),
    new HtmlWebpackPlugin({
      filename: '200.html',
      chunks: ['main', 'vendor', 'manifest'],
      template: 'index.ejs',
    }),
    new CopyWebpackPlugin([
      { from: 'sitemap.xml' },
      { from: '.htaccess' },
      { from: 'fines.html' },
      { from: 'data.csv' },
      { from: 'images/facebook.png', to: 'images/facebook.png' },
      { from: 'images/favicons' },
    ]),
    new ExtractTextPlugin({
      filename: 'bundle.css',
      disable: false,
      allChunks: true,
    }),
  ],
};

module.exports = config;
