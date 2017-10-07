const { resolve } = require('path');
const root = (src) => resolve(process.cwd(), src);
const fs = require('fs');
const Reader = require('fs-scanner');

const writeFile = ({content, pathName}, cb) => new Promise((resolve, reject) => {
  let options = {
    flags: 'w',
    defaultEncoding: 'utf8',
  };

  let wstream = fs.createWriteStream(pathName, options);

  wstream.write(content);

  wstream.on('error', (err) => reject(err));

  wstream.on('finish', () => resolve(pathName));

  wstream.end();
});

const writePath = content => new Promise((resolve, reject) => {
  writeFile({
    content: JSON.stringify(content, null, '\t'),
    pathName: root('config/utils/paths.json')
  })
  .then(file => resolve(file))
  .catch(err => reject(err))
});

const cwd = new Reader({
  path: root('.'),
  ignore: [ 'node_modules/*', '.git', 'config' ],
});

const build = new Reader({
  path: root('src'),
  ignore: [ 'node_modules/*', '.git', 'config' ],
  prefix: {
    src: 'build',
  },
});

const collection = cwd.collection.concat(build.collection);
const tree = Object.assign(cwd.tree, {build: build.tree});

collection.push(root('build/public'));

const content = { collection, tree };

module.exports = function() {
  return writePath(content)
};