// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

// Code migrated from: https://github.com/webpack-contrib/style-loader
// It was extremely simplified and adopted to web & node environments in order to solve the issue with:
//   ReferenceError: document is not defined
// In addition I learned how to write webpack loader ;)

const loaderUtils = require('loader-utils');
const path = require('path');

const loaderCode = path.join(__dirname, 'webpack-style-loader-code.js');

module.exports = () => {};

module.exports.pitch = function loader(request) {
  const options = loaderUtils.getOptions(this) || {};

  return `  
var content = require(${loaderUtils.stringifyRequest(this, `!!${request}`)});
var options = ${JSON.stringify(options)};

require(${loaderUtils.stringifyRequest(this, `!${loaderCode}`)})(content, options);
`;
};
