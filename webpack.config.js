const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const BUILD_DIR = path.resolve(__dirname, 'out');
const APP_DIR = path.resolve(__dirname, 'src');

const config = {
  entry: {
    main: `${APP_DIR}/index.jsx`,
    embed: `${APP_DIR}/embed.jsx`,
  },
  output: {
    path: BUILD_DIR,
    publicPath: '/',
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js?/,
        exclude: /node_modules\/(?!d3-bumps-chart)/,
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
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
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
      { from: '.htaccess' },
      { from: 'images/facebook.png', to: 'images/facebook.png' },
    ]),
  ],
};

module.exports = config;
