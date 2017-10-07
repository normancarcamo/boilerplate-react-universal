module.exports = {
  // Add asset Information
  assets: true,
  // Sort assets by a field
  assetsSort: 'field',
  // Add information about cached (not built) modules
  cached: false,
  // Show cached assets (setting this to `false` only shows emitted files)
  cachedAssets: false,
  // Add children information
  children: false,
  // Add chunk information (setting this to `false` allows for a less verbose output)
  chunks: false,
  // Add built modules information to chunk information
  chunkModules: false,
  // Add the origins of chunks and chunk merging info
  chunkOrigins: false,
  // Sort the chunks by a field
  chunksSort: 'field',
  // `webpack --colors` equivalent
  colors: true,
  // Display the distance from the entry point for each module
  depth: false,
  // Display the entry points with the corresponding bundles
  entrypoints: true,
  // Add errors
  errors: true,
  // Add details to errors (like resolving log)
  errorDetails: false,
  // Exclude modules which match one of the given strings or regular expressions
  exclude: [],
  // Add the hash of the compilation
  hash: false,
  // Set the maximum number of modules to be shown
  maxModules: 15,
  // Add built modules information
  modules: false,
  // Sort the modules by a field
  modulesSort: 'field',
  // Show dependencies and origin of warnings/errors (since webpack 2.5.0)
  moduleTrace: false,
  // Show performance hint when file size exceeds `performance.maxAssetSize`
  performance: false,
  // Show the exports of the modules
  providedExports: false,
  // Add public path information
  publicPath: true,
  // Add information about the reasons why modules are included
  reasons: true,
  // Add the source code of modules
  source: true,
  // Add timing information
  timings: true,
  // Show which exports of a module are used
  usedExports: false,
  // Add webpack version information
  version: true,
  // Add warnings
  warnings: true,
  // Filter warnings to be shown (since webpack 2.4.0),
  // can be a String, Regexp, a function getting the warning and returning a boolean
  // or an Array of a combination of the above. First match wins.
  // warningsFilter: "filter" | /filter/ | ["filter", /filter/] | (warning) => ... return true|false
};