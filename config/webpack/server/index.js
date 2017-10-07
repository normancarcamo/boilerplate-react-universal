process.noDeprecation = true;

const webpack = require('webpack');
const path = require('path');
const modules = require('../shared/module');  // set rules like babel-loader, css-loader, etc...
const resolve = require('../shared/resolve'); // write paths...
const plugins = require('./plugins');         // use plugins like ExtractTextPlugin...
const nodeExternals = require('webpack-node-externals');
const root = (src) => path.resolve(process.cwd(), src);
const PRODUCTION = process.env.NODE_ENV === 'production';
const SERVER = true;

const config = {
  name: 'Webpack server',
  devtool: 'cheap-module-eval-source-map',
  target: 'node',
  node: { __dirname: false, __filename: false, fs: 'empty' },
  externals: [nodeExternals()],
  context: root('src'),
  entry : {
    app : [
      root('src/server/entry.js'),
    ]
  },
  output: {
    filename               : 'index.js',
    path                   : root('src/server'),
    chunkFilename          : '../../build/public/chunks/[name].[chunkhash].js',
    hotUpdateChunkFilename : '../../build/public/hot/[id].[hash].hot-update.js',
    sourceMapFilename      : '../../build/public/source-maps/[id].[name].[chunkhash].map',
  },
  module: modules(SERVER, PRODUCTION),
  resolve: resolve,
  plugins: plugins,
};

module.exports = config;