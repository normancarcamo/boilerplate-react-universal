// Dependencies:
const { exec, execSync } = require('child_process');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { resolve } = require('path');
const root = path => resolve(process.cwd(), path);

const config = {
  dev:  {
    options: {
      default: ['v','s','f', 'verbose', 'server', 'file'],
      option: {
        v: false,
        s: false,
        w: true,
        e: true,
        b: true,
        p: true,
        verbose: false,
        server: false,
        watch: true,
        errors: true,
        bail: true,
        process: true,
      },
    },
  },
  prod:  {
    options: {
      default: ['v','s','f', 'verbose', 'server', 'file'],
      option: {
        v: true,
        s: false,
        w: false,
        e: true,
        b: true,
        p: true,
        c: true,
        verbose: true,
        compile: true,
        server: false,
        watch: false,
        errors: true,
        bail: true,
        process: true,
      },
    },
  },
  alias: {
    e: 'errors',
    b: 'bail',
    p: 'progress',
    v: 'verbose',
    w: 'watch',
    c: 'compile',
    s: 'server',
  },
  options: {
    errors: 'e',
    bail: 'b',
    progress: 'p',
    verbose: 'v',
    watch: 'w',
    compile: 'c',
    server: 's',
  },
  default: {
    e: true,
    b: true,
    p: true,
    v: true,
    w: true,
    c: true,
    s: false,
  },
};

const resetCLI = () => {
  process.stdout.write('\x1Bc');
}

function isFunction(x) {
  return Object.prototype.toString.call(x) == '[object Function]'
}

function isNumber(n) {
  return /^\d+$/.test(n)
}

function isString(input) {
  return (typeof input === 'string') ? true : false
}

function isBoolean(value) {
  return !!(typeof value === 'boolean')
}

function isStringBoolean(value) {
  if (value) {
    return /(true|false)/.test(value.toString().trim().toLowerCase());
  } else {
    return false;
  }
}

function normalizeOptions(str) {
  return str.split(/,\s?/).reduce(function(initial, current, index) {
    if (current.includes('=')) {
      let indexEqualsSign = current.search('=');
      let option = current.substr(0, indexEqualsSign);
      let value = current.substr(indexEqualsSign+1).toString().toLowerCase();
      if (isString(value) && isStringBoolean(value)) {
        initial[option] = JSON.parse(value);
      }
    } else {
      initial[current] = true;
    }
    return initial;
  }, {});
}

function checkIfOptionIsAvailable(type, options) {
  if (type) {
    const exists = (option) => config[type].options.default.indexOf(option) >= 0;
    const loop = (options) => options.reduce((initial, option, index) => {
      initial[option] = exists(option);
      return initial;
    }, {});

    if (isObject(options)) {
      return loop(Object.keys(options));
    } else if (isArray(options)) {
      return loop(options);
    } else if (isString(options)) {
      return exists(options);
    } else {
      return false;
    }
  } else {
    return false;
  }
}

// √
function setProgress(message, delay, callback) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(message);
  if (isFunction(callback)) {
    if (delay) {
      setTimeout(() => {callback(null);}, delay);
    } else {
      callback(null);
    }
  } else {
    return new Promise((resolve) => {
      if (delay) {
        setTimeout(() => {resolve();}, delay);
      } else {
        resolve();
      }
    });
  }
}

// √
const getInfo = () => {
  return {
    platform: execSync('uname -a', {encoding: 'utf8'}),
    pid: process.pid,
    memoryUsage: process.memoryUsage(),
    programmingLanguage: 'JavaScript (Node)',
    nodeVersion: execSync('node -v', {encoding: 'utf8'}),
    npmVersion: execSync('npm -v', {encoding: 'utf8'}),
    nodeEnv: process.env.NODE_ENV,
    nodePath: process.execPath,
    cwd: process.cwd(),
    env: process.env,
  }
}

function isArray(o) {
  return !!o && typeof o === "object" && o.length !== undefined
}

function isObject(value) {
  if (Object.prototype.toString.call(value) !== '[object Object]') {
    return false
  } else {
    var prototype = Object.getPrototypeOf(value)
    return prototype === null || prototype === Object.prototype
  }
}

function isString(o) {
  return typeof o === 'string'
}

function isFunction(x) {
  return Object.prototype.toString.call(x) == '[object Function]'
}

function merge(a, b) {
  return Object.assign(a, b)
}

function execCommand({ command, options, title, args }, callback) {
  if (command && isString(command)) {
    var child = exec(command);

    // Check errors:
    child.stderr.on('data', data => {
      // Show the errors only if the buffer is available, the options are available too and if the error option is available:
      if (data && args && args.e) {
        process.stdout.write('\x1Bc');
        console.log('\n---------------------------------------------------------------'.rainbow.dim);
        console.log(`Error during the compilation of ${title.red}\n`.red);
        console.log(`${data}`);
        console.log('\n---------------------------------------------------------------'.rainbow.dim);
        if (args.b) {
          process.exit();
        }
        return
      }
    });

    // Print a message when the command has runned succesfully:
    if (options.msgBody) {
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(options.msgBody);
    }

    // Print the output:
    child.stdout.on('data', data => {

      // If during the compilation process an error was found:
      if (data.includes('ERROR') && args.b) {
        process.stdout.write('\x1Bc');
        console.log('---------------------------------------------------------------\n'.rainbow.dim);
        console.log(`Error during the compilation of ${title.red}\n`.red);
        console.log(`${data}`);
        console.log('\n---------------------------------------------------------------'.rainbow.dim);
        process.exit();
        return;
      }

      // If there wasn't any error found then it will display the output (only if the verbose option is enabled):
      if (args.v) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write('');
        console.log(String(data))
      }
    });

    // Execute the callback response:
    child.on('close', code => {
      if (callback instanceof Promise || isFunction(callback)) {
        callback(code);
      }
    });
  } else {
    process.stdout.write('\x1Bc');
    console.log(`No command provided or the command is invalid, it must be string type. (execCommand)`);
    if (args && args.b) {
      process.exit();
    }
    return;
  }
}

function handleCommand({ command, options = { msgHead: null, msgBody: null }, title, args }, callback) {
  if (command && isString(command)) {
    if (isFunction(callback)) {
      // Print a message before start running the command:
      if (options.msgHead) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(options.msgHead);
      }

      execCommand({ command, options, title, args }, callback);
    } else {
      return new Promise((resolve) => {
        // Print a message before start running the command:
        if (options.msgHead) {
          process.stdout.clearLine();
          process.stdout.cursorTo(0);
          process.stdout.write(options.msgHead);
        }

        execCommand({ command, options, title, args }, resolve);
      });
    }
  } else {
    process.stdout.write('\x1Bc');
    console.log(`No command provided or the command is invalid, it must be string type. (handleCommand)`);
    if (args && args.b) {
      process.exit();
    }
    return;
  }
}

let _errored = false;
let configName;

function compileWebpack({ webpackConfig, devServer = false, devServerOptions, optionsCLI, stats, onChange }) {
  let firstCompilation = true;
  let errored = false;
  let optionsStats = stats ? stats : { errorDetails: false, colors: true };

  // See for more details the following url: https://webpack.js.org/configuration/watch
  let watchOptions = {
    // Add a delay before rebuilding once the first file changed.
    // This allows webpack to aggregate any other changes made during this time period into one rebuild.
    // Pass a value in milliseconds:
    aggregateTimeout: 300,

    // Turn on polling by passing true, or specifying a poll interval in milliseconds:
    poll: true,

    // For some systems, watching many file systems can result in a lot of CPU or memory usage.
    // It is possible to exclude a huge folder like node_modules:
    ignored: /node_modules/,
  };

  const handleFatalError = (error, msg) => {
    resetCLI();
    console.log('---------------------------------------------------------------'.rainbow.dim);
    if (msg) {
      console.log(`${msg.yellow}\n`);
    }
    console.error(`${error}`.red);
    console.log('\n---------------------------------------------------------------'.rainbow.dim);
    configName = webpackConfig.name;
    return;
  }

  const handleSoftErrors = (errors, msg) => {
    resetCLI();
    console.log('---------------------------------------------------------------'.rainbow.dim);
    if (errors.length > 2) {
      if (msg) {
        console.log(`\n${msg.yellow}\n`);
      }
      errors.forEach((err, i) => console.error(`Error #${i} -> ${err}`.red));
      console.log(`\nTotal errors: ${errors.length}`.yellow);
      if (!firstCompilation) {
        console.log(`\nPlease try to fix ${errors.length > 1 ? `them` : 'it'} on ${webpackConfig.name}.\n`.yellow);
      }
    } else {
      console.error(`${errors[0]}`.red);
    }

    configName = webpackConfig.name;
    console.log('\n---------------------------------------------------------------'.rainbow.dim);
    return;
  }

  const handleWarnings = (warnings, msg) => {
    resetCLI();
    console.log('---------------------------------------------------------------'.rainbow.dim);
    if (msg) {
      console.log(`${msg}\n`);
    }
    warnings.forEach((err) => console.warn(`${err}`.red));
    console.log(`\nTotal warnings: ${warnings.length}\n`.yellow);
    console.log('---------------------------------------------------------------'.rainbow.dim);
    configName = webpackConfig.name;
    return;
  }

  return new Promise((resolve, reject) => {

    let compiler = webpack(webpackConfig, (err, stats) => {
      if (err) {
        errored = true;
        _errored = true;
        if (isFunction(onChange) && optionsCLI.s) {
          onChange(errored);
        }
        return reject(handleFatalError(err, `Fatal error when trying to compile: "${webpackConfig.name}"`));
      } else {

        if (optionsCLI && optionsCLI.w) {
          // The "stats" object that is passed as a second argument of the webpack() callback,
          // is a good source of information about the code compilation process:

          const watching = compiler.watch(watchOptions, (err, stats) => {

            // stats.hasErrors() -> Can be used to check if there were errors while compiling. Returns true or false.
            if (err) {
              errored = true;
              _errored = true;
              if (isFunction(onChange) && optionsCLI.s) {
                onChange(errored);
              }
              return reject(handleFatalError(err, `Fatal error when trying to compile: "${webpackConfig.name}"`));
            }

            // Returns compilation information as a JSON object.
            // options can be either a string (a preset) or an object for more granular control:
            // example: stats.toJson("minimal"); // more options: "verbose", etc.
            // More details can be found in: https://webpack.js.org/configuration/stats
            let jsonStats = stats.toJson(optionsStats);

            if (jsonStats.errors.length > 0) {
              errored = true;
              _errored = true;
              if (isFunction(onChange) && optionsCLI.s) {
                onChange(errored);
              }
              return reject(handleSoftErrors(jsonStats.errors, `Error when trying to compile: "${webpackConfig.name}"`));
            }

            if(jsonStats.warnings.length > 0) {
              errored = true;
              if (isFunction(onChange)) {
                onChange(errored);
              }
              return reject(handleWarnings(jsonStats.warnings, `Warnings found: when trying to compile: "${webpackConfig.name}"`));
            }

            if (errored) {
              if (_errored) {
                resetCLI();
                console.log(`Webpack has recovered from errors! √.\n`.green);
                setTimeout(() => {resetCLI();}, 900);
              }

              errored = false;
              _errored = false;
              firstCompilation = false;
              if (isFunction(onChange) && optionsCLI.s) {
                onChange(errored);
              }
            } else {
              if (firstCompilation) {
                resetCLI();
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                process.stdout.write(`${`${webpackConfig.name} has compiled successfully.`.gray} ${`√\n`.green}`);
                firstCompilation = false;

                if (devServer) {
                  devServerOptions.clientLogLevel = 'none';
                  devServerOptions.stats.errors = false;
                  devServerOptions.noInfo = false;
                  devServerOptions.quiet = false;

                  let server = new WebpackDevServer(compiler, devServerOptions)
                  .listen(8080, '0.0.0.0', () => {
                    if (!optionsCLI.v) {
                      resolve({ server, webpackConfig });
                    } else {
                      setTimeout(() => {
                        resolve({ server, webpackConfig });
                      }, 4000);
                    }
                  }).on('error', (err) => reject({
                    err: err,
                    message: err.message,
                    title: `Error during the compilation of ${webpackConfig.name || 'untitled'}`,
                    source: webpackConfig.name,
                  }));
                  return;
                } else {
                  setTimeout(() => {resetCLI();}, 700);
                  return resolve({ stats: jsonStats, startServer: true, config: webpackConfig });
                }
              } else {
                resetCLI();
                console.log(`${webpackConfig.name} has changed. √`.gray);
                setTimeout(() => {resetCLI();}, 700)
                if (isFunction(onChange) && optionsCLI.s) {
                  onChange(errored);
                }
              }
            }

            return resolve({ stats: jsonStats, config: webpackConfig });
          });
        } else {
          // The "stats" object that is passed as a second argument of the webpack() callback,
          // is a good source of information about the code compilation process:
          let server = compiler.run((err, stats) => {

            // stats.hasErrors() -> Can be used to check if there were errors while compiling. Returns true or false.
            if (err || stats.hasErrors()) {
              return reject(handleFatalError(err, `Fatal error when trying to compile: "${webpackConfig.name}"`, stats.hasErrors()));
            }

            // Returns compilation information as a JSON object.
            // options can be either a string (a preset) or an object for more granular control:
            // example: stats.toJson("minimal"); // more options: "verbose", etc.
            // More details can be found in: https://webpack.js.org/configuration/stats
            let jsonStats = stats.toJson(optionsStats);

            if (jsonStats.errors.length > 0) {
              return reject(handleSoftErrors(jsonStats.errors, `Error when trying to compile: "${webpackConfig.name}"`));
            }

            if(jsonStats.warnings.length > 0) {
              return reject(handleWarnings(jsonStats.warnings, `Warnings found: when trying to compile: "${webpackConfig.name}"`));
            }

            if (!optionsCLI.w) {
              resetCLI();
              process.stdout.clearLine();
              process.stdout.cursorTo(0);
              process.stdout.write(`${`${webpackConfig.name} has compiled successfully.`.gray} ${`√\n`.green}`);
              setTimeout(() => {resetCLI();}, 700);
            }

            return resolve({ stats: jsonStats, server: server, config: webpackConfig });
          });
        }
      }
    });
  });
}

function webpackDevServer({ webpackConfig, devServerOptions, optionsCLI }) {
  return new Promise((resolve, reject) => {
    if (isObject(webpackConfig) && isObject(devServerOptions)) {
      if (optionsCLI) {
        if (optionsCLI.v) {
          devServerOptions.stats = "normal";
          devServerOptions.noInfo = false;
          devServerOptions.quiet = false;
          devServerOptions.clientLogLevel = 'info';
        } else if (optionsCLI.w && !optionsCLI.v && !optionsCLI.s) {
          // Stats altered:
          devServerOptions.stats.errors = false;
          devServerOptions.stats.entrypoints = false;
          devServerOptions.stats.assets = false;
          devServerOptions.stats.version = false;
          devServerOptions.stats.publicPath = false;
          devServerOptions.stats.warnings = false;
          devServerOptions.stats.source = false;
          devServerOptions.stats.reasons = false;

          // Options of devServer altered:
          devServerOptions.noInfo = false;
          devServerOptions.quiet = false;
          devServerOptions.clientLogLevel = 'none';
        }
      }

      let compiler = webpack(webpackConfig, (err, stats) => {
        if (err || stats.hasErrors()) {
          reject({
            err: err,
            message: err ? err.message : '',
            title: `Error during the compilation of ${webpackConfig.name || 'untitled'}`,
            source: webpackConfig.name,
          });
        } else {
          setProgress('').then(() => {
            let server = new WebpackDevServer(compiler, devServerOptions)
              .listen(8080, '0.0.0.0', () => {
                if (!optionsCLI.v) {
                  resolve({ server, webpackConfig });
                } else {
                  setTimeout(() => {
                    resolve({ server, webpackConfig });
                  }, 4000);
                }
              }).on('error', (err) => reject({
                err: err,
                message: err.message,
                title: `Error during the compilation of ${webpackConfig.name || 'untitled'}`,
                source: webpackConfig.name,
              }));
          });
        }
      });
    } else {
      process.stdout.write('\x1Bc');
      console.log('You need to provide the webpackConfig and the webpack dev server options');
      if (optionsCLI && optionsCLI.b) {
        process.exit();
      }
      return;
    }
  });
}

function resolveOptions(defaults, options) {
  let out = options.reduce((target, current, index) => {
    let option = current.toString().trim().toLowerCase();
    let enable = false;

    if (option.includes("=")) {
      let _index = option.search("=");
      let _option = option.substr(0, _index);

      // It doesn't ends with letters:
      if (!/[a-z]$/g.test(_option)) {
        enable = false;
        option = _option
      } else { // It does:
        if (option === `${_option}=true`) {
          enable = true;
          option = _option
        } else {
          enable = false;
          option = _option
        }
      }
    } else {
      if (option.endsWith("true")) {
        let _index = option.search("true")
        let _option = option.substr(0, _index);
        enable = false;
        option = _option
      } else if (option.endsWith("false")) {
        let _index = option.search("false")
        let _option = option.substr(0, _index);
        enable = false;
        option = _option
      } else {
        enable = true;
      }
    }

    if (config.options[option]) {
      target[config.options[option]] = enable;
    } else {
      target[option] = enable;
    }

    return target;
  }, {});
  return merge(defaults, out);
}

module.exports.getInfo = getInfo
module.exports.handleCommand = handleCommand
module.exports.compileWebpack = compileWebpack
module.exports.webpackDevServer = webpackDevServer
module.exports.merge = merge
module.exports.resolveOptions = resolveOptions
module.exports.config = config
module.exports.setProgress = setProgress
module.exports.resetCLI = resetCLI
module.exports.isString = isString
module.exports.isStringBoolean = isStringBoolean
module.exports.isBoolean = isBoolean
module.exports.normalizeOptions = normalizeOptions
module.exports.checkIfOptionIsAvailable = checkIfOptionIsAvailable