const proxy   = require('./proxy');
const stats   = require('./stats');
const { resolve } = require('path');
const root = src => resolve(process.cwd(), src);
const PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = {
  stats: stats, //"errors-only",
  // This option lets you precisely control what bundle information gets displayed.
  // This can be a nice middle ground if you want some bundle information, but not all of it.
  // See more details at: https://webpack.js.org/configuration/stats/
  noInfo: true,
  // With noInfo enabled, messages like the webpack bundle information that is shown when starting up and after each save, will be hidden.
  // Errors and warnings will still be shown.
  quiet: true,
  // With quiet enabled, nothing except the initial startup information will be written to the console.
  // This also means that errors or warnings from webpack are not visible.
  clientLogLevel: 'none',
  // Controls the log messages shown in the browser. values: ["none", "info", "warning", "error"]
  compress: true,
  // Gzip compression for all requests.
  contentBase: root('build/public'),
  // A directory to serve files non-webpack files from.
  disableHostCheck: true,
  // Disable the Host header check (Security).
  historyApiFallback: { index: '/index.html' },
  // 404 fallback to a specified file.
  headers: {
    'Access-Control-Allow-Origin': '*',
    // this header is used to avoid "cors" warnings and problems.
  },
  // Adds headers to all responses.
  host: '0.0.0.0',
  // The host the server listens to.
  hot: true,
  // Enables Hot Module Replacement.
  open: false,
  // Let the CLI open your browser with the URL.
  overlay: { errors: true, warnings: true, },
  // Shows an error overlay in browser.
  // proxy: proxy,
  // Proxy requests to another server.
  publicPath: '/',
  // "URL path where the webpack files are served from."
  port: 8080,
  // The port the server listens to.
  watchContentBase: false,
  // Watches the contentBase directory for changes.
  // False because we are using hot module replacement, if enabled then it will reload the page, enable if you need.
  watchOptions: {
    watch: true,
    poll: true,
    aggregateTimeout: 0, // 300 The default
    ignored: /node_modules/,
  },
  // For more information about these options see this link: https://webpack.js.org/configuration/watch/
  serverSideRender: true,
  // Turn off the server-side rendering mode. See Server-Side Rendering part for more info.
};

// For more information about these options see this link: https://webpack.js.org/configuration/dev-server