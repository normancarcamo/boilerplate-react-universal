const rules = require('./rules');

module.exports = function(SERVER, PRODUCTION) {
  return {
    exprContextCritical: false,
    rules: rules(SERVER, PRODUCTION),
  }
};