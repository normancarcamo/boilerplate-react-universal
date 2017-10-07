const { resolve } = require('path');
const root = (src) => resolve(process.cwd(), src);
const { collection } = require(root('config/utils/paths.json'));

module.exports = {
	extensions: ['.js', '.json', '.jsx', '.css', '.styl', '.scss', '.sass', '.less'],
  modules: collection,
};