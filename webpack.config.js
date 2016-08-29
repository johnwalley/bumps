var webpack = require('webpack');
var path = require('path');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, 'out');
var APP_DIR = path.resolve(__dirname, 'src');

var config = {  
  entry: {
    main: APP_DIR + '/index.jsx',
    embed: APP_DIR + '/embed.jsx',
  },
  output: {
    path: BUILD_DIR,
    publicPath: '/',
    filename: '[name].bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: APP_DIR,
        loader: 'babel',
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.css$/,
        loader: 'style!css',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      chunks: ['main'],
      template: 'index.ejs',
    }),
    new HtmlWebpackPlugin({
      filename: 'embed.html',
      chunks: ['embed'],
      template: 'embed.ejs',
    }),
    new CopyWebpackPlugin([
            { from: 'CNAME' },
            { from: '404.html' },
            { from: 'images/facebook4.png', to: 'images/facebook4.png' }
    ]),
  ],
};

module.exports = config;
