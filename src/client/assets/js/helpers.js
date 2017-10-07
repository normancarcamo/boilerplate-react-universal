export function isBrowser() {
  return !!(typeof window !== 'undefined')
}

export function removeInitialState() {
  if (isBrowser()) {
    var parent = window.document.querySelector('head');
    var child = window.document.getElementById('__initial_state__');
    if (child) {
      parent.removeChild(child);
    }
    window.__INITIAL_STATE__ = null;
  }
}

export function disableLogHMR() {
  if (isBrowser()) {
    if (process.env.NODE_ENV === 'development') {
      // This is a workaround used alongside the webpack-dev-server hot-module-reload feature
      //  - it's quite chatty on the console, and there's no currently no configuration option
      //    to silence it. Only used in development.
      // Prevent messages starting with [HMR] or [WDS] from being printed to the console
      (function(global) {
        let console_log = global.console.log
        global.console.log = function() {
          if (!(arguments.length == 1 && typeof arguments[0] === 'string' && arguments[0].match(/^\[(HMR|WDS)\]/))) {
            console_log.apply(global.console,arguments)
          }
        }
        // Credits to: https://github.com/webpack/webpack-dev-server/issues/109#issuecomment-143189783
      })(window)
    }
  }
}

export function arrayHasValues(array) {
  let contains = false

  if (array) {
    if (isArray(array)) {
      if (array.length) {
        contains = true
      } else {
        contains = false
      }
    } else {
      contains = false
    }
  } else {
    contains = false
  }

  return contains
}

export function isNull(x) {
  return !!(x === null)
}
