const webpack = require('webpack');
const config = require('./config');
const plugins = require('./plugins');
const { resolve } = require('path');
const root = (src) => resolve(process.cwd(), src);
const PRODUCTION = process.env.NODE_ENV === 'production';

config.name = 'Webpack dll';

config.output.library = '[name]';

plugins.push(
  new webpack.DllPlugin({
    path: root('build/public/manifest/[name]-manifest.json'),
    // The path to the manifest file which maps between
    // modules included in a bundle and the internal IDs
    // within that bundle:
    name: '[name]',
    // The name of the global variable which the library's
    // require function has been assigned to. This must match the
    // output.library option:
  })
);

config.plugins = plugins;
config.devServer = {};

module.exports = config;