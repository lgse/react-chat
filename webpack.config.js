var fs = require('node-fs-extra');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var Webpack = require('webpack');
var WebpackOnBuildPlugin = require('on-build-webpack');
var __DEV__ = process.env.NODE_ENV !== 'production';
var __DIST__ = process.env.DIST === true;

var plugins = [
  new Webpack.optimize.OccurenceOrderPlugin(),
  new ExtractTextPlugin('client.min.css'),
  new Webpack.DefinePlugin({
    'global.__DEV__': (__DEV__) ? 'true' : 'false',
    'process.env.NODE_ENV': (__DEV__) ? '"development"' : '"production"',
  }),
];

if (!__DEV__) {
  plugins.push(
    new Webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      mangle: true,
      compress: {
        warnings: false
      },
    }),
    new WebpackOnBuildPlugin(function() {
      var distStamp = new Date().getTime();
      var distDir = `${__dirname}/dist`;

      fs.removeSync(distDir);
      fs.mkdirpSync(distDir);
      fs.copy(`${__dirname}/static`, `${__dirname}/dist`, function (err) {
        if (err) {
          return console.log(err);
        }

        fs.readFile(`${__dirname}/dist/index.html`, 'utf-8', function(err, data){
          if (err) {
            return console.log(err);
          }

          var modified = data.replace('client.min.css', `client.min.css?${distStamp}`);
          modified = modified.replace('client.min.js', `client.min.js?${distStamp}`);

          fs.writeFile(`${__dirname}/dist/index.html`, modified, 'utf-8', function (err) {
            if (err) {
              return console.log(err);
            }
          });
        });
      });

      console.log('Distribution Stamp: ' + distStamp);
    })
  );
}

module.exports = {
  context: __dirname + '/src',
  devtool: __DEV__ ? 'inline-source-map' : null,
  entry: {
    client: './client.js'
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        test: /\.jsx?$/,
      },
      {
        loader: 'eslint-loader',
        exclude: /(node_modules)/,
        test: /\.jsx?$/,
      },
      {
        loader: 'json',
        test: /\.json$/,
      },
      {
        loader: ExtractTextPlugin.extract("css-loader?minimize"),
        test: /\.css$/,
      },
    ]
  },
  output: {
    path: `${__dirname}/${__DIST__ ? 'dist' : 'static'}`,
    filename: '[name].min.js'
  },
  plugins: plugins,
};