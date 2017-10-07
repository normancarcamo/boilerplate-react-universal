// const target = "/api";
const target = '**';

module.exports = {
  [target]: {
    target: 'http://localhost:3000',
    changeOrigin: true
  }
};