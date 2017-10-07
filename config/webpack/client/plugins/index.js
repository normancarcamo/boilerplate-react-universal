// Dependencies:
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const PurifyCSSPlugin = require('purifycss-webpack')
const webpack = require('webpack')
const glob = require('glob-all')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const PRODUCTION = process.env.NODE_ENV === 'production'

// Helpers:
const { resolve } = require('path')
const root = (src) => resolve(process.cwd(), src)
const freevars = require(root('config/webpack/shared/freevars'))

const plugins = [
  new HtmlWebpackPlugin({
    title: PRODUCTION ? 'Production' : 'Development',
    filename: 'index.html',
    template: root('config/template/index.pug'),
    hash: PRODUCTION,
    cache: PRODUCTION,
    environment: process.env.NODE_ENV || 'development',
    chunksSortMode: 'dependency',
    minify: { html5: PRODUCTION, minifyCSS: PRODUCTION, minifyJS: PRODUCTION, removeComments: PRODUCTION, removeEmptyAttributes: PRODUCTION },
    showErrors: true,
    inject: 'body',
    alwaysWriteToDisk: true,
    inlineSource: PRODUCTION ? null : '.css$',
  }),
  new HtmlWebpackInlineSourcePlugin(),
  new webpack.DefinePlugin(freevars),
  new webpack.optimize.CommonsChunkPlugin({ name: ['manifest', 'vendor'].reverse(), }),
  new ManifestPlugin({ fileName: 'manifest/manifest.json', publicPath: '/', writeToFileEmit: true }),
  new ExtractTextPlugin({
    filename:  getPath => getPath('css/[name].[contenthash].css'),
    allChunks: true
  }),
  new PurifyCSSPlugin({
    styleExtensions: [ '.css' ],
    moduleExtensions: [ '.html' , '.css' ],
    minimize: true,
    paths: glob.sync([
      `${root('build/public')}/**/*.css`,
    ]),
    purifyOptions: { whitelist: ['*purify*'] },
    verbose: false,
  }),
]

if (PRODUCTION) {
  plugins.push(
    new webpack.HashedModuleIdsPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
      stylus: {
        preferPathResolver: 'webpack',
      },
    }),
    // FAVICON:
    new FaviconsWebpackPlugin({
      logo: root('config/favicon/favicon.png'),
      prefix: 'icons/',
      emitStats: false,
      path: '/favicon.ico',
      url: '/favicon.ico',
      statsFilename: 'stats/iconstats-[hash].json',
      persistentCache: true,
      inject: true,
      background: '#000',
      preferOnline: false,
      // Use offline generation, if online generation has failed. `boolean`
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        coast: false,
        favicons: false,
        firefox: true,
        opengraph: true,
        twitter: true,
        yandex: true,
        windows: true
      },
      // which icons should be generated (see https://github.com/haydenbleasel/favicons#usage)
    }),
    // GZIP compression.
    new CompressionPlugin({
      asset: 'gzip/[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|html|css|json)$/
    }),
    // No emit errors:
    new webpack.NoEmitOnErrorsPlugin()
  )
} else {
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    // DLL's plugin configurations.
    new HtmlWebpackHarddiskPlugin({ /* More information at: https://github.com/jantimon/html-webpack-harddisk-plugin */ })
  )
}

module.exports = plugins