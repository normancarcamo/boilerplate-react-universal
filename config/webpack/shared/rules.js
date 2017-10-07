const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { resolve } = require('path');
const root = (src) => resolve(process.cwd(), src);

const postCSSOptions = {
  sourceMap: 'inline',
  plugins: [
    require('postcss-smart-import')({ /* ...options */ }),
    require('precss')({ /* ...options */ }),
    require('autoprefixer')({
      browsers : [
        'last 3 version',
        'ie >= 10',
      ],
    }),
  ],
};

const sassOptions = {
  includePaths : [
    root('node_modules'),
    root('src'),
  ],
  sourceMap: true,
  data: `$env: ${process.env.NODE_ENV};`,
};

function styleLoader(SERVER, PRODUCTION) {
  return {
    singleton: !PRODUCTION,
    sourceMap: !PRODUCTION,
    convertToAbsoluteUrls: true,
  };
}

function cssLoader(SERVER, PRODUCTION) {
  if (PRODUCTION || SERVER) {
    return ExtractTextPlugin.extract({
      publicPath: '/',
      fallback: { loader: 'style-loader', options: styleLoader(SERVER, PRODUCTION) },
      use: [
        { loader: 'css-loader',
          options: {
            minimize: true,
            sourceMap: true,
            modules: true,
            camelCase: true,
            importLoaders: 1,
            localIdentName: 'purify_[name]_[local]_[hash:base64:5]',
          },
        },
        { loader: 'postcss-loader', options: postCSSOptions },
      ],
    });
  } else {
    return [
      { loader: 'style-loader', options: styleLoader(SERVER, PRODUCTION) },
      { loader: 'css-loader',
        options: {
          minimize: false,
          sourceMap: true,
          modules: true,
          camelCase: true,
          importLoaders: 1,
          localIdentName: 'purify_[name]_[local]_[hash:base64:5]',
        },
      },
      { loader: 'postcss-loader', options: postCSSOptions },
    ];
  }
}

function stylusLoader(SERVER, PRODUCTION) {
  if (PRODUCTION || SERVER) {
    return ExtractTextPlugin.extract({
      publicPath: '/',
      fallback: { loader: 'style-loader', options: styleLoader(SERVER, PRODUCTION) },
      use: [
        { loader: 'css-loader',
          options: {
            minimize: true,
            sourceMap: true,
            modules: true,
            camelCase: true,
            importLoaders: 2,
            localIdentName: 'purify_[name]_[local]_[hash:base64:5]',
          },
        },
        { loader: 'postcss-loader', options: postCSSOptions },
        {
          loader: 'stylus-loader',
          options: {
            inline: true,
            compress: true,
            preferPathResolver: 'webpack',
            use: [require('nib')()],
            import: ['~nib/lib/nib/index.styl'],
            include: [
              root('src/client/assets'),
              root('build/src/client/assets')
            ],
          },
        },
      ]
    });
  } else {
    return [
      { loader: 'style-loader', options: styleLoader(SERVER, PRODUCTION) },
      { loader: 'css-loader',
        options: {
          minimize: false,
          sourceMap: true,
          modules: true,
          camelCase: true,
          importLoaders: 2,
          localIdentName: 'purify_[name]_[local]_[hash:base64:5]',
        },
      },
      { loader: 'postcss-loader', options: postCSSOptions },
      {
        loader: 'stylus-loader',
        options: {
          inline: true,
          compress: false,
          preferPathResolver: 'webpack',
          use: [require('nib')()],
          import: ['~nib/lib/nib/index.styl'],
          include: [
            root('src/client/assets'),
            root('build/src/client/assets')
          ],
        },
      },
    ];
  }
}

function sassLoader(SERVER, PRODUCTION) {
  if (PRODUCTION || SERVER) {
    return ExtractTextPlugin.extract({
      publicPath: '/',
      fallback: { loader: 'style-loader', options: styleLoader(SERVER, PRODUCTION) },
      use: [
        { loader: 'css-loader',
          options: {
            minimize: true,
            sourceMap: true,
            modules: true,
            camelCase: true,
            importLoaders: 2,
            localIdentName: 'purify_[name]_[local]_[hash:base64:5]',
          },
        },
        { loader: 'postcss-loader', options: postCSSOptions },
        {
          loader: 'sass-loader',
          options: sassOptions,
        },
      ]
    });
  } else {
    return [
      { loader: 'style-loader', options: styleLoader(SERVER, PRODUCTION) },
      { loader: 'css-loader',
        options: {
          minimize: false,
          sourceMap: true,
          modules: true,
          camelCase: true,
          importLoaders: 2,
          localIdentName: 'purify_[name]_[local]_[hash:base64:5]',
        },
      },
      { loader: 'postcss-loader', options: postCSSOptions },
      {
        loader: 'sass-loader',
        options: sassOptions,
      },
    ];
  }
}

function lessLoader(SERVER, PRODUCTION) {
  if (PRODUCTION || SERVER) {
    return ExtractTextPlugin.extract({
      publicPath: '/',
      fallback: { loader: 'style-loader', options: styleLoader(SERVER, PRODUCTION) },
      use: [
        { loader: 'css-loader',
          options: {
            minimize: true,
            sourceMap: true,
            modules: true,
            camelCase: true,
            importLoaders: 2,
            localIdentName: 'purify_[name]_[local]_[hash:base64:5]',
          },
        },
        { loader: 'postcss-loader', options: postCSSOptions },
        {
          loader: 'less-loader',
          options: {
            sourceMap: true
          },
        },
      ]
    });
  } else {
    return [
      { loader: 'style-loader', options: styleLoader(SERVER, PRODUCTION) },
      { loader: 'css-loader',
        options: {
          minimize: false,
          sourceMap: true,
          modules: true,
          camelCase: true,
          importLoaders: 2,
          localIdentName: 'purify_[name]_[local]_[hash:base64:5]',
        },
      },
      { loader: 'postcss-loader', options: postCSSOptions },
      {
        loader: 'less-loader',
        options: {
          sourceMap: true
        },
      },
    ];
  }
}

function babelLoader(SERVER, PRODUCTION) {
  let options = {
    presets: [
      [
        'env', {
          'modules': false,
          'targets': {
            'uglify': false
          }
        }
      ],
      'react',
      'flow',
      'stage-2'
    ],
    plugins: [
      ['transform-runtime', {
        helpers: true,
        polyfill: true,
        regenerator: true,
        moduleName: 'babel-runtime',
      }],
      ['transform-regenerator', {
        asyncGenerators: true,
        generators: true,
        async: true
      }],
      'dynamic-import-webpack',
      'transform-class-properties'
    ],
  };

  if (SERVER) {
    options.babelrc = true;
    options.compact = false;
  } else {
    options.plugins.push('react-hot-loader/babel');
    options.babelrc = false;
  }

  return [{
    loader: 'babel-loader?cacheDirectory=true', // More info at: https://github.com/babel/babel-loader#options
    options: options
  }];
}

function fontLoader(SERVER, PRODUCTION, LOADER) {
  let array = [];
  if (LOADER === "file-loader") {
    array = [{
      loader: LOADER,
      options: {
        name       : '[name].[hash].[ext]',
        outputPath : SERVER ? '../../build/public/fonts/' : 'fonts/',
        publicPath : '/',
      },
    }];
  } else {
    array = [{
      loader : LOADER,
      options : {
        limit : 1048576, // 1kb
        name  : SERVER ? '../../build/public/fonts/' : 'fonts/' + '[name].[hash:8].[ext]',
      },
    }];
  }
  return array;
}

function imgLoader(SERVER, PRODUCTION, LOADER) {
  let array = [];
  if (LOADER === "file-loader") {
    array = [{
      loader       : LOADER,
      options      : {
        name       : '[name].[hash].[ext]',
        outputPath : SERVER ? '../../build/public/img/' : 'img/',
        publicPath : '/',
      },
    }];
  } else {
    array = [{
      loader  : LOADER,
      options : {
        limit : 1048576, // 1kb
         name : SERVER ? '../../build/public/img/' : 'img/' + '[name].[hash:8].[ext]',
      },
    }];
  }
  return array;
}

function svgLoader(SERVER, PRODUCTION, LOADER) {
  let array = [];
  if (LOADER === "file-loader") {
    array = [{
      loader: LOADER,
      options: {
        name       : '[name].[hash].[ext]',
        outputPath : SERVER ? '../../build/public/svg/' : 'svg/',
        publicPath : '/',
      },
    }];
  } else {
    array = [{
      loader: LOADER,
      options: {
        limit : 1048576, // 1kb
        name  : SERVER ? '../../build/public/svg/' : 'svg/' + '[name].[hash:8].[ext]',
      },
    }];
  }
  return array;
}

function pugLoader(PRODUCTION) {
  return [
    {
      loader: 'pug-loader',
      // More info about the loader at: https://github.com/willyelm/pug-html-loader
      options: {
        pretty: !PRODUCTION,
        // Find more options at: https://pugjs.org/api/reference.html
      },
    }
  ];
}

function htmlLoader(PRODUCTION) {
  return [
    {
      loader: 'html-loader',
      options: {
        minimize: PRODUCTION,
      },
    },
  ];
}

function audioAndVideoLoader(SERVER, PRODUCTION, LOADER) {
  let array = [];
  if (LOADER === "file-loader") {
    array = [{
      loader: LOADER,
      options: {
        name       : '[name].[hash].[ext]',
        outputPath : SERVER ? '../../build/public/media/' : 'media/',
        publicPath : '/',
      },
    }];
  } else {
    array = [{
      loader: LOADER,
      options: {
        limit : 1048576, // 1kb
        name  : SERVER ? '../../build/public/media/' : 'media/' + '[name].[hash:8].[ext]',
      },
    }];
  }
  return array;
}

module.exports = function(SERVER, PRODUCTION) {
  const loaders = [
    { // BABEL:
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      include: [ root('src') ],
      use: babelLoader(SERVER, PRODUCTION),
    },
    { // CSS:
      test: /\.css$/,
      use: cssLoader(SERVER, PRODUCTION),
    },
    { // STYLUS:
      test: /\.styl$/,
      use: stylusLoader(SERVER, PRODUCTION),
    },
    { // SASS:
      test: /\.(scss|sass)$/,
      use: sassLoader(SERVER, PRODUCTION),
    },
    { // LESS:
      test: /\.less$/,
      use: lessLoader(SERVER, PRODUCTION),
    },
    { // FONTS:
      test:/\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
      use: fontLoader(SERVER, PRODUCTION, 'file-loader'),
    },
    { // IMAGES:
      test: /\.(jpe?g|jpg|png|gif|ico)$/i,
      use: imgLoader(SERVER, PRODUCTION, 'url-loader'),
    },
    { // SVG:
      test: /\.svg$/i,
      use: svgLoader(SERVER, PRODUCTION, 'file-loader'),
    },
    { // AUDIO & VIDEO:
      test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
      use: audioAndVideoLoader(SERVER, PRODUCTION, 'file-loader'),
    },
    { // PUG:
      test: /\.pug/,
      use: pugLoader(PRODUCTION),
    },
    { // HTML:
      test: /\.html$/,
      use: htmlLoader(PRODUCTION),
    },
    { // JSON:
      test: /\.json$/,
      loader: 'json-loader',
    },
    { // EJS:
      test: /\.ejs$/,
      loader: 'ejs-loader',
    },
  ];

  return loaders;
};