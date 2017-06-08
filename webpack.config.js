const path = require('path');

const webpackConfigs = {
  entry: {
    app: ['./main.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist',
    filename: '[name].js',
  },
};

module.exports = webpackConfigs;
