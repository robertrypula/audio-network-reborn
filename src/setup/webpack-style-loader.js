// Copyright (c) 2019-2021 Robert Rypuła - https://github.com/robertrypula

// Code based on: https://github.com/webpack-contrib/style-loader
// It was extremely simplified and adopted to web & node environments in order
// to solve the issue with: ReferenceError: document is not defined
// In addition I learned how to write webpack loader ;)

const loaderUtils = require('loader-utils');
const path = require('path');
const validateOptions = require('schema-utils');

const loaderCode = path.join(__dirname, 'webpack-style-loader-code.js');

const schema = {
  type: 'object',
  properties: {
    rootElementId: { type: 'string' }
  }
};

module.exports = () => {};

module.exports.pitch = function loader(request) {
  const options = loaderUtils.getOptions(this) || {};

  validateOptions(schema, options, 'Style Loader');

  return `
var styles = require(${loaderUtils.stringifyRequest(this, `!!${request}`)});
var options = ${JSON.stringify(options)};

require(${loaderUtils.stringifyRequest(this, `!${loaderCode}`)})(styles, options);
`;
};
