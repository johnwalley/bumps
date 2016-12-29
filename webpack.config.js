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
    embed: `${APP_DIR}/embed.jsx`,
    vendor: ['react', 'react-dom', 'react-router', 'react-hammerjs', 'react-share', 'material-ui', 'd3'],
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
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract({
          loader: 'css-loader?sourceMap'
        })
      },
    ],
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      chunks: ['main', 'vendor', 'manifest'],
      template: 'index.ejs',
    }),
    new HtmlWebpackPlugin({
      filename: 'embed.html',
      chunks: ['embed', 'vendor', 'manifest'],
      template: 'embed.ejs',
    }),
    new CopyWebpackPlugin([
      { from: '.htaccess' },
      { from: 'images/facebook.png', to: 'images/facebook.png' },
      { from: 'images/favicons' },
    ]),
    new ExtractTextPlugin({
      filename: 'bundle.css',
      disable: false,
      allChunks: true
    }),
  ],
};

module.exports = config;
