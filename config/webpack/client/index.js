const webpack = require('webpack');
const config = require('./config');
const plugins = require('./plugins');
const devServer = require('./devServer');
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const root = (src) => path.resolve(process.cwd(), src);
const PRODUCTION = process.env.NODE_ENV === 'production';

config.name = 'Webpack client';

if (PRODUCTION) {
  plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      async: 'used-twice',
      minChunks(module, count) {
        return count >= 2
      },
    })
    , new webpack.optimize.CommonsChunkPlugin({
      name: 'chunks/react-chunk',
      minChunks: (m) => /node_modules\/(?:react|react-dom|react-loadable)/.test(m.context)
    })
    , new BundleAnalyzerPlugin({ analyzerMode: 'static' })
  );
}

plugins.push(
  // Webpack DLL's:
  new webpack.DllReferencePlugin({
    context: root('build/public'),
    manifest: require(root('build/public/manifest/app-manifest.json')),
  }),
  new webpack.DllReferencePlugin({
    context: root('build/public'),
    manifest: require(root('build/public/manifest/manifest-manifest.json')),
  }),
  new webpack.DllReferencePlugin({
    context: root('build/public'),
    manifest: require(root('build/public/manifest/vendor-manifest.json')),
  })
);

config.plugins = plugins;
config.devServer = devServer;

module.exports = config;