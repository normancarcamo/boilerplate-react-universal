const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = [
  new webpack.HashedModuleIdsPlugin(),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false,
    stylus: {
      preferPathResolver: 'webpack',
    },
  }),
  new ExtractTextPlugin({
    filename:  getPath => getPath('../../build/public/css/[name].[contenthash].css'),
    allChunks: true
  }),
  new webpack.NoEmitOnErrorsPlugin(),
];
