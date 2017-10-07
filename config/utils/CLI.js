const {
  handleCommand,
  compileWebpack,
  webpackDevServer,
  config,
  setProgress,
  resetCLI,
  normalizeOptions
} = require('./CLIScripts.js');
const path = require('path');
const root = (src) => path.resolve(process.cwd(), src);
const nodemon = require('nodemon');
const nodemonConfig = require('./nodemon.json');
const colors = require('colors');
const EventEmitter = require('events');
const stats = require('../webpack/client/stats');
const pkg = require(process.cwd()+'/package.json');
const scanCurrentWorkingDirectory = require('./WritePaths.js');
const prompt = new EventEmitter();
const result = { type: null, options: null };
var current = null;
var _question = "";

console.reset = function () {
  'use strict';
  return process.stdout.write('\x1Bc');
}

process.stdin.resume();

prompt.on(':ask', (type, question) => {
  console.reset();
  current = type;
  console.log(question);
  process.stdout.write('> ');
});

prompt.emit(':ask', 'type', 'What type of environment will you use (dev|prod)?'.yellow);

prompt.on('type', (data) => {
  result.type = data;
  prompt.emit(data);
});

process.stdin.on('data', function(_data) {
  let data = _data.toString().trim();
  if (!result.type && ['dev', 'prod'].indexOf(data) == -1) {
    prompt.emit(':ask', 'type', 'What type of environment will you use (dev|prod)?'.yellow);
  } else {
    prompt.emit(current, data);
  }
});

prompt.on(':end', function(data) {
  const nextStep = (type, options) => {
    console.reset();
    process.stdin.pause();
    prompt.emit(`:${type}`, options);
  }

  let option = data.toString().trim().toLowerCase();

  if (!option) {
    if (result.type == 'prod') {
      option = 'v'
    } else {
      option = 'v=false'
    }
  }

  let options = normalizeOptions(option);
  result.options = Object.assign(config[result.type].options.option, options);
  nextStep(result.type, result.options);
});

prompt.on('dev', function(data) {
  prompt.emit(':ask', ':end', `${'Select options for dev to continue:'.yellow}

    ${`Option:    Alias:   Description:                                      Default:`.cyan}
    server     s        Start "express" server (backend)                  ${`false`.grey}
    verbose    v        Show the details of the compilation process       ${`false`.grey}

    ${'Examples:'.cyan}
    v, s=false

    ${`Note:`.cyan} ${`If you don't want to select any option just press enter`.grey}
  `);
});

prompt.on('prod', function(data) {
  prompt.emit(':ask', ':end', `${'Select options for prod to continue:'.yellow}

    ${`Option:    Alias:   Description:                                      Default:`.cyan}
    server     s        start the server                                  ${`false`.grey}
    verbose    v        Show the details of the compilation process       true

    ${'Examples:'.cyan}
    v, s=false

    ${`Note:`.cyan} ${`If you don't want to select any option just press enter`.grey}
  `);
});

prompt.on(':dev', (options) => {
  const compileWebpackDLL = 'BABEL_ENV=development && NODE_ENV=development && node_modules/.bin/webpack --config config/webpack/client/dll.js --colors';
  const devServerOptions = require('../webpack/client/devServer');
  let nodemonStarted = false;

  devServerOptions.stats.errors = options.e

  function onServerChange(error) {
    if (!error) {
      if (nodemonStarted) {
        nodemon.emit('restart')
      } else {
        nodemon(nodemonConfig)
      }
    }
  }

  function onServerStart(server) {
    if (server) {
      nodemon(nodemonConfig)
      nodemonStarted = true
    }
  }

  setProgress(`${`Removing temp directories...`.yellow} ${'15%'.cyan}`)
    .then(() => handleCommand({ command: "node_modules/.bin/rimraf ./build", title: 'Removing temp directories', args: options }))
    .then(() => setProgress(`${`Scan current working directory...`.yellow} ${'28%'.cyan}`))
    .then(() => scanCurrentWorkingDirectory())
    .then(() => setProgress(`${`Compiling webpack for dll's...`.yellow} ${'32%'.cyan}`))
    .then(() => handleCommand({ command: compileWebpackDLL, title: 'Dll\'s compilation', args: options }))
    .then(() => setProgress(`${`Compiling webpack for client...`.yellow} ${'45%'.cyan}`))
    .then(() => webpackDevServer({ webpackConfig: require('../webpack/client/index.js'), devServerOptions: devServerOptions, optionsCLI: options }))
    .then(() => {
      if (options.s) {
        return setProgress(`${`Compiling webpack for server...`.yellow} ${'59%'.cyan}`)
          .then(() => compileWebpack({ webpackConfig: require('../webpack/server/index.js'), optionsCLI: options, stats: stats, onChange: onServerChange }))
          .then(() => setProgress(`${`Staring express server...`.yellow} ${'74%'.cyan}`))
          .then(() => onServerStart(true))
          .then(() => setProgress('Complete!...'.yellow + '100%'.cyan))
          .then(() => {
            setTimeout(() => {
              process.stdout.clearLine();
              process.stdout.cursorTo(0);
            }, 1000);
          });
      }
    })
    .then(() => {
      if (!options.s) {
        setProgress(`${options.v ? '\n' : ''}${`Complete!...`.yellow} ${'100%'.cyan}`, 100, () => {
          setProgress('', 0, () => {
            if (!options.w) {
              process.exit();
            }
          });
        });
      }
    })
    .catch(({ err, message, title, source }) => setProgress('').then(() => {
      console.log('\n---------------------------------------------------------------\n'.rainbow.dim);
      if (title) {console.log(`${title}\n`.yellow);}
      if (message) {console.log(`${message}`.red);}
      console.log('\n---------------------------------------------------------------\n'.rainbow.dim);
      if (options.b) {process.exit();}
    }));
});

prompt.on(':prod', (options) => {
  // Commands:
  var removeTemp = 'node_modules/.bin/rimraf ./build && node_modules/.bin/rimraf config/utils/paths.json && node config/utils/writePaths.js'
  var compileWebpackDLL = `BABEL_ENV=production && NODE_ENV=production && node_modules/.bin/webpack --config=config/webpack/client/dll.js --colors ${options.f ? '--env.file' : '--env.file=false'}`
  var compileWebpackClient = `BABEL_ENV=production && NODE_ENV=production && node_modules/.bin/webpack --config=config/webpack/client/index.js -p --cache=true --colors ${options.f ? '--env.file' : '--env.file=false'}`
  var compileWebpackServer = 'BABEL_ENV=production && NODE_ENV=production && node_modules/.bin/webpack --config=config/webpack/server/index.js -p --cache=true --colors'
  var compileBabel = 'BABEL_ENV=production && NODE_ENV=production && node_modules/.bin/babel src --out-dir build/src --presets env,react --plugins dynamic-import-webpack,transform-class-properties --compact true --no-comments --no-highlight-code -D'

  // Messages:
  var msgDistFolder =                          'Removing temp directories      '.gray + `12%${options.v ? '\n'   : ''}`.cyan
  var msgCurrentWorkingDirectory =             'Scan current working directory '.gray + `26%${options.v ? '\n'   : ''}`.cyan
  var msgWebpackDLLs =                         `Compiling webpack for dll's    `.gray + `35%${options.v ? '\n\n' : ''}`.cyan
  var msgWebpackClient =                       'Compiling webpack for client   '.gray + `58%${options.v ? '\n\n' : ''}`.cyan
  var msgWebpackServer =                       'Compiling webpack for server   '.gray + `79%${options.v ? '\n\n' : ''}`.cyan
  var msgBabel =                               'Transpiling cwd with Babel     '.gray + `92%${options.v ? '\n\n' : ''}`.cyan
  var msgstart = `${options.v ? '' : '\n'}Files has been transpiled!, now you can start using the "build" folder to deploy your application with es5 syntax.`.gray + ` √${options.s ? '\n\n' : '\n'}`.bold.green

  // Promise style:
  handleCommand({command: removeTemp, options: {msgBody: msgDistFolder}, title: 'Removing temp directories', args: options})
    .then(() => setProgress(msgCurrentWorkingDirectory, 3000))
    .then(() => scanCurrentWorkingDirectory())
    .then(() => handleCommand({command: compileWebpackDLL, options: {msgBody: msgWebpackDLLs}, title: 'Webpack Dll\'s.', args: options }))
    .then(() => handleCommand({command: compileWebpackClient, options: {msgBody: msgWebpackClient}, title: 'Webpack client.', args: options }))
    .then(() => handleCommand({command: compileWebpackServer, options: {msgBody: msgWebpackServer}, title: 'Webpack server.', args: options }))
    .then(() => handleCommand({command: compileBabel, options: {msgBody: msgBabel}, title: 'Webpack server.', args: options }))
    .then(() => {
      if (options.s) {
        handleCommand({
          command: 'NODE_ENV=production && node build/src/server/index.js',
          options: { msgBody: msgstart },
          title: 'Nodemon server.',
          args: options
        })
      } else {
        if (!options.v) {
          resetCLI();
        }
        console.log(msgstart)
      }
    })
    .catch(({ err, message, title, source }) => setProgress('').then(() => {
      console.log('\n---------------------------------------------------------------\n'.rainbow.dim);
      if (title) {console.log(`${title}\n`.yellow);}
      if (message) {console.log(`${message}`.red);}
      console.log('\n---------------------------------------------------------------\n'.rainbow.dim);
      if (options.b) {process.exit();}
    }));
});

process.once('SIGINT', () => process.exit(0));