const { fromJS } = ('immutable')

// --------------------------------------------------------------------------------------- String:
export function isString(input) {
  return (typeof input === 'string') ? true : false
}
export function isStringWithValue(o) {
  return (o && typeof o === 'string') ? true : false
}
// --------------------------------------------------------------------------------------- Number:
export function getMaxNumberFromArray(array) {
  return Math.max.apply(null, array)
}
export function isNumber(n) {
  return /^\d+$/.test(n)
}
export function isNumberFormatted(n) {
  if (/\d/g.test(n) && /\,/g.test(n)) {
    if (/^[0-9]{1,9}$/g.test(n)) {
      return false
    } else {
      if (/[a-zA-Z]/g.test(n)) {
        return false
      } else {
        return true
      }
    }
  } else {
    return false
  }
}
export function convertStringNumber(data) {
  if (/\d/g.test(data) && /\,/g.test(data)) {
    if (/^[0-9]{1,9}$/g.test(data)) {
      return data
    } else {
      if (/[a-zA-Z]/g.test(data)) {
        return data
      } else {
        return Number(data.replace(/\,/g, ''))
      }
    }
  } else {
    return data
  }
}
// --------------------------------------------------------------------------------------- Array:
export function isArray(o) {
  return !!o && typeof o === "object" && o.length !== undefined
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
export function getValuesOfAPropertyFromCollection(list, prop, ignore, source) {
  let items = [], falsyValues = []

  list.forEach((item, index) => {
    for (let i in item) {
      if (ignore) {
        for (let j in ignore) {
          if (j === i) {
            if (ignore[j]) {
              if (ignore[j] === item[i]) {
              } else {
                items.push(item[prop])
              }
            } else {
            }
          }
        }
      } else {
        if (i === prop) {
          items.push(item[i])
        }
      }
    }

    if (ignore && 'falsyValues' in ignore && ignore.falsyValues) {
      if (typeof items[index] === "number") {
        if (items[index] === 0) {
          falsyValues.push(null)
        } else {
          falsyValues.push(items[index])
        }
      } else {
        falsyValues.push(items[index])
      }
    }
  })
  return (falsyValues.length) ? falsyValues : items
}
export function getMaxStringOnAnArrayOfObjects(collection, propName) {
  // Util when you want to know which cell of a column has more characters and get the max number.
  let strings = getValuesOfAPropertyFromCollection(collection, propName)
  let lengths = []
  strings.push(propName)
  strings.forEach((str, index) => {
    lengths.push(JSON.stringify(str).trim().length)
  })
  return { propName, max: getMaxNumberFromArray(lengths) }
}
// --------------------------------------------------------------------------------------- Object:
export function objectWithoutProp(prop, object) {
  return Object.keys(object).reduce((initial, value, index) => {
    if (value !== prop) {
      initial[value] = object[value] // ok -> { firstName: 'Norman', lastName: 'Carcamo' }
    }
    return initial
  }, {})
}
export function searchValueInCollection({ text, collection, caseSensitive, propName }) {
  console.log('Searching - Text:', text,', Case sensitive:', caseSensitive, 'Collection length:', collection.length, 'Where:', propName)
  // INTRO:
  // The idea of the following script is iterate over each item in the collection provided and return back a new version of the collection with the items that were found:
  // PD: Two things that you have to know about it:
  //   1. The script will return a new collection, that means that the original one will be always immutable.
  //   2. It will return an empty array if it couldn't find items.

  // We have to ensure that the text param provided is a string,
  // no matter if the value is a number, it has to come as a string, otherwise it will return back an empty array.
  if (isString(text)) {

    // The idea of this variable is catch the property names:
    let props = null

    // First we have to know if the results have policies when searching:

    // This policy is just to let the script know that the results will are being returned using case sensitive or not, for example: A or a:
    if (!caseSensitive) {
      // Case sensitive is not a priority, so we will search the value in lower case :)
      text = text.toString().trim().toLowerCase()
    }

    return collection.reduce((array, item, index) => {
      // Get the property names of the first item to use them later in the rest of items in the collection:
      if (index === 0) { props = Object.keys(item) }

      if (isString(propName) && item[propName]) {
        // Get the current value of the current item in "propName" that is iterating:
        let regex = new RegExp(text, caseSensitive ? 'g' : 'gi')
        let value = ''

        // Case sensitive?
        if (caseSensitive) {
          value = item[propName].toString()
        } else {
          value = item[propName].toString().trim().toLowerCase()
        }

        // return item if it's found:
        if (value.match(regex)) { array.push(item) }
      } else {
        // Found?
        let found = props.reduce((initial, key, index) => {

          // Get the current value of the current item that is iterating:
          let value = item[key].toString()

          // Case sensitive?
          if (!caseSensitive) {value = item[key].toString().trim().toLowerCase()}

          // return item if it's found:
          if (value.search(text) >= 0) {
            initial = item
          }

          // End of loop of the property names:
          if (index === props.length-1) { /*console.info('Props loop ended.')*/ }

          // Return the item whether if it was found or not:
          return initial
        }, {})

        // If and item was found using the text provided well, insert it in the array:
        if (objectHasValues(found)) { array.push(found) }
      }

      // End of the collection:
      if (index === collection.length-1) { /*console.info('Collection loop ended.')*/ }

      // Return back the items that were found:
      return array
    }, [])
  } else {
    return []
  }
}
export function isObject(value) {
  if (Object.prototype.toString.call(value) !== '[object Object]') {
    return false
  } else {
    var prototype = Object.getPrototypeOf(value)
    return prototype === null || prototype === Object.prototype
  }
}
export function objectHasValues(obj) {
  if (typeof obj === "object") {
    if (Object.getOwnPropertyNames(obj).length > 0) {
      return true
    } else {
      return false
    }
  } else if (typeof obj === 'undefined') {
    return false
  }
}
export function objectHasProperty(object, property) {
  function search(obj, prop) {
    return Object.keys(obj).reduce((initial, current, index) => {
      if (prop === current) {
        return true
      } else {
        if (isObject(obj[current])) {
          return search(obj[current], property)
        }
      }
      return initial
    }, false)
  }
  return search(object, property)
}
// ---------------------------------------------------------------------------------------- Functions:
export function isFunction(x) {
  return Object.prototype.toString.call(x) == '[object Function]'
}
export function functionIsEmpty(x) {
  if (x) {
    if (isFunction(x)) {
      let start = x.toString().search(/\{/i)+1
      let content = x.toString().substr(start).trim()
      let end = content.search(/\}$/g)-1
      return !content.substr(0, end).length
    }
  }
}
// --------------------------------------------------------------------------------------- boolean:
export function isBoolean(value) {
  return !!(typeof value === 'boolean')
}
// --------------------------------------------------------------------------------------- Dates:
export function isDate(str) {
  let a = /\d{4}\/\d{2}\/\d{2}/i
    , b = /\d{2}\/\d{2}\/\d{4}/i
    , c = /\d{2}\-\d{2}\-\d{4}/i
    , d = /\d{4}\-\d{2}\-\d{2}/i

  return !!(a.test(str) || b.test(str) || c.test(str) || d.test(str))
}
// --------------------------------------------------------------------------------------- undefined:
export function isUndefined(x) {
  return !!(x === undefined)
}
// --------------------------------------------------------------------------------------- null:
export function isNull(x) {
  return !!(x === null)
}
// --------------------------------------------------------------------------------------- React.js:
export function isReactComponent(x) {
  return !!(x && objectHasValues(x) && ('$$typeof' in x) && (typeof x['$$typeof'] === 'symbol') && (x['$$typeof'].toString() === 'Symbol(react.element)'))
}
export function createMarkup(text) { return {__html: text} }
// --------------------------------------------------------------------------------------- CSS:
export function getUnitCSSAndValue(s) {
  if (s && isUnitCSSWithNumber(s)) {
    let value = /^\d+(px|pt|em|rem)/g
    let unit = /(px|pt|em|rem)/g
    let results = { value: s, unit: null }

    if (value.test(s)) {
      let i = s.search(unit)
      if (i > -1) {
        results.value = s.substr(0, i)
        results.unit  = s.substr(i, s.length)
      }
    }

    return results
  }
}
export function isUnitCSSWithNumber(str) {
  if (['initial','auto','inherit'].indexOf(str) >= 0) {
    return false
  } else {
    if (/^\d+$/.test(str) || isStringWithValue(str)) {
      return true
    } else {
      return false
    }
  }
}
export function extractValueFromUnitCSS(s) {
  let unit = /(px|pt|em|rem)/g
  let i = s.search(unit)
  if (i > -1) {
    return Number(s.substr(0, i))
  } else {
    return s
  }
}
// ---------------------------------------------------------------------------------------- Sort:
export function sortArray(arrA, arrB) {
  return arrA.reduce((initial, value, index) => {
    if (arrB.indexOf(value) === -1) {
      initial.push(value)
    }
    return initial
  }, [])
}
export function sortCollectionNumber(list, desc, prop) {
  if (desc) {
    list.sort((a, b) => {
      let valueA = a[prop], valueB = b[prop]

      if (arrayHasValues(a[prop])) {
        if (isNumber(a[prop][0]) || isNumberFormatted(a[prop][0])) {
          valueA = a[prop][0]
        }
      }

      if (arrayHasValues(b[prop])) {
        if ( isNumber(b[prop][0]) || isNumberFormatted(b[prop][0]) ) {
          valueB = b[prop][0]
        }
      }

      return convertStringNumber(valueA) - convertStringNumber(valueB)
    })
  } else {
    list.sort((a, b) => {
      let valueA = a[prop], valueB = b[prop]

      if (arrayHasValues(a[prop])) {
        if (isNumber(a[prop][0]) || isNumberFormatted(a[prop][0])) {
          valueA = a[prop][0]
        }
      }

      if (arrayHasValues(b[prop])) {
        if (isNumber(b[prop][0]) || isNumberFormatted(b[prop][0])) {
          valueB = b[prop][0]
        }
      }

      return convertStringNumber(valueA) - convertStringNumber(valueB)
    }).reverse()
  }
  return list
}
export function sortCollectionString(list, desc, prop) {
  if (desc) {
    list.sort((a, b) => (a[prop] < b[prop]) ? -1 : (a[prop] > b[prop]) ? 1 : 0)
  } else {
    list.sort((a, b) => (a[prop] < b[prop]) ? -1 : (a[prop] > b[prop]) ? 1 : 0).reverse()
  }
  return list
}
export function sortCollectionDate(list, desc, prop) {
  if (desc) {
    list.sort((a, b) => new Date(a[prop]) - new Date(b[prop])).reverse()
  } else {
    list.sort((a, b) => new Date(a[prop]) - new Date(b[prop]))
  }
  return list
}
export function sortCollectionBoolean(list, desc, prop) {
  if (desc) {
    list.sort((a, b) => b[prop] - a[prop]).reverse()
  } else {
    list.sort((a, b) => b[prop] - a[prop])
  }
  return list
}
export function sortCollection(collection, datatype, prop, desc) {
  let list = fromJS(collection).toJS()
  let info = 'Not implemented yet.'

  switch (datatype) {
    case 'undefined':
      console.info(info)
      break
    case 'null':
      console.info(info)
      break
    case 'array':
      console.info(info)
      break
    case 'object':
      console.info(info)
      break
    case 'number':
      list = sortCollectionNumber(list, desc, prop)
      break
    case 'boolean':
      list = sortCollectionBoolean(list, desc, prop)
      break
    case 'date':
      list = sortCollectionDate(list, desc, prop)
      break
    default:
      list = sortCollectionString(list, desc, prop)
      break
  }

  return list
}
// ---------------------------------------------------------------------------------------- Various:
export function isBrowser() {
  return !!(typeof window !== 'undefined')
}
export function merge(a, b) {
  return Object.assign(a, b)
}
export function removeInitialState() {
  if (isBrowser()) {
    var parent = window.document.querySelector('head')
    var child = window.document.getElementById('__initial_state__')
    if (parent && child) {
      parent.removeChild(child)
    }
    window.__INITIAL_STATE__ = null
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