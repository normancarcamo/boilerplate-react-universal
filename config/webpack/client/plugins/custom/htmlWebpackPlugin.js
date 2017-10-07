function MyPlugin(options) {
  this.nombre = options;
}

MyPlugin.prototype.apply = function(compiler) {
  // ...
  compiler.plugin('compilation', function(compilation) {
    compilation.plugin('html-webpack-plugin-before-html-processing', function(data, callback) {
      // console.log('************************************');
      // console.log('1.', data.assets.js);
      // console.log('2.', data.assets.css);
      // console.log('************************************');
      callback(null, data)
    })
  })
};

module.exports = MyPlugin;