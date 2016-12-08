// global.Promise = require('bluebird'); // for node 0.10

var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');

module.exports = [
  {
    name: 'js',
    entry: {
      index: './public/js/index.js'

    },
    output: {
      path: './public/build/js',
      filename: "[name].js"
    },
    devtool: "eval",
    module: {
      loaders: [
        { test: /\.js$/, loader: "react-hot!babel", exclude: [/node_modules/] },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel',
          query: {
            presets: ['es2015', 'react']
          }
        }
      ]
    },
    plugins: [
      // new webpack.DefinePlugin({
      //     "process.env": {
      //         BROWSER: JSON.stringify(true),
      //         NODE_ENV: JSON.stringify( process.env.NODE_ENV || 'development' )
      //     }
      // }),
      // new ExtractTextPlugin("[name].css", {allChunks: true})
    ],
    eslint: {
      // configFile: path.resolve('.eslintrc') !eslint-loader -- add to test loader
    }
  }];
